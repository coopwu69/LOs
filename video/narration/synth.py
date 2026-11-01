"""Synthesize narration.json into per-line WAVs + a timing manifest.

Draft voice: Meta MMS-TTS Thai (vits-mms-tha, via sherpa-onnx), fully offline.
The model has a single male speaker; --voice female re-pitches it with the
WORLD vocoder (F0 x pitch, spectral envelope warped by formant) and adds short
pauses between phrases for clearer diction.

Replace public/audio/*.wav with a human/pro TTS recording using the same ids
and re-run with --measure-only to refresh durations.

Usage: python3 synth.py [--voice female|raw] [--measure-only] [--only 2,3]
"""
import argparse
import json
import re
from pathlib import Path

import numpy as np
import soundfile as sf

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "public" / "audio"
PHRASE_PAUSE_S = 0.14


def spoken(line):
    s = line.get("say", line["text"])
    s = re.sub(r"[“”\"'.]", "", s)
    s = s.replace("–", " ").replace("—", " ")
    s = s.replace("ำ", "ํา")  # ำ -> ํ + า (model has no ำ token)
    return re.sub(r"\s+", " ", s).strip()


def feminize(x, sr, pitch, formant):
    import pyworld as pw

    x = x.astype(np.float64)
    f0, t = pw.harvest(x, sr, f0_floor=60, f0_ceil=400, frame_period=5.0)
    sp = pw.cheaptrick(x, f0, t, sr)
    ap = pw.d4c(x, f0, t, sr)
    bins = np.arange(sp.shape[1])
    src = bins / formant  # shorter vocal tract: envelope moves up in frequency
    warp = lambda m: np.array([np.interp(src, bins, row) for row in m])
    y = pw.synthesize(f0 * pitch, np.maximum(warp(sp), 1e-16), np.clip(warp(ap), 0, 1), sr, frame_period=5.0)
    return y.astype(np.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model-dir", default="/home/user/tts/vits-mms-tha")
    ap.add_argument("--measure-only", action="store_true")
    ap.add_argument("--only", default="", help="comma-separated scenes or line ids")
    ap.add_argument("--voice", choices=["female", "raw"], default="female")
    ap.add_argument("--length-scale", type=float, default=1.12)
    ap.add_argument("--pitch", type=float, default=1.72)
    ap.add_argument("--formant", type=float, default=1.17)
    args = ap.parse_args()

    lines = json.load(open(HERE / "narration.json", encoding="utf-8"))
    only = {x for x in args.only.split(",") if x}
    OUT.mkdir(parents=True, exist_ok=True)

    tts = None
    if not args.measure_only:
        import sherpa_onnx
        md = Path(args.model_dir)
        tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(
                vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                    model=str(md / "model.onnx"), tokens=str(md / "tokens.txt"),
                    noise_scale=0.33, noise_scale_w=0.5, length_scale=args.length_scale),
                num_threads=4)))

    manifest = {}
    for line in lines:
        wav = OUT / f"{line['id']}.wav"
        if tts and (not only or line["id"] in only or str(line["scene"]) in only):
            parts, sr = [], 16000
            for phrase in spoken(line).split(" "):
                audio = tts.generate(phrase, sid=0, speed=1.0)
                sr = audio.sample_rate
                parts += [np.asarray(audio.samples, dtype=np.float32), np.zeros(int(sr * PHRASE_PAUSE_S), np.float32)]
            samples = np.concatenate(parts[:-1])
            if args.voice == "female":
                samples = feminize(samples, sr, args.pitch, args.formant)
            samples *= 0.89 / max(1e-6, float(np.abs(samples).max()))  # peak -1 dBFS
            sf.write(wav, samples, sr)
        if wav.exists():
            info = sf.info(wav)
            manifest[line["id"]] = round(info.frames / info.samplerate, 3)
    (HERE.parent / "src" / "audio-durations.json").write_text(json.dumps(manifest, indent=1))
    print(f"{len(manifest)} lines, total {sum(manifest.values()):.1f}s")


if __name__ == "__main__":
    main()
