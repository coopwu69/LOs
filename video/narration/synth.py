"""Synthesize narration.json into per-line WAVs + a timing manifest.

Draft voice: Meta MMS-TTS Thai (vits-mms-tha, via sherpa-onnx), fully offline.
Replace public/audio/*.wav with a human/pro TTS recording using the same ids
and re-run with --measure-only to refresh durations.

Usage: python3 synth.py [--model-dir DIR] [--measure-only] [--only 2,3]
"""
import argparse
import json
import re
from pathlib import Path

import numpy as np
import soundfile as sf

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "public" / "audio"


def spoken(line):
    s = line.get("say", line["text"])
    s = re.sub(r"[“”\"'.]", "", s)
    s = s.replace("–", " ").replace("—", " ")
    s = s.replace("ำ", "ํา")  # ำ -> ํ + า (model has no ำ token)
    return re.sub(r"\s+", " ", s).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model-dir", default="/home/user/tts/vits-mms-tha")
    ap.add_argument("--measure-only", action="store_true")
    ap.add_argument("--only", default="")
    ap.add_argument("--length-scale", type=float, default=1.05)
    args = ap.parse_args()

    lines = json.load(open(HERE / "narration.json", encoding="utf-8"))
    scenes = {int(x) for x in args.only.split(",") if x}
    OUT.mkdir(parents=True, exist_ok=True)

    tts = None
    if not args.measure_only:
        import sherpa_onnx
        md = Path(args.model_dir)
        tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(
                vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                    model=str(md / "model.onnx"), tokens=str(md / "tokens.txt"),
                    noise_scale=0.5, noise_scale_w=0.6, length_scale=args.length_scale),
                num_threads=4)))

    manifest = {}
    for line in lines:
        wav = OUT / f"{line['id']}.wav"
        if tts and (not scenes or line["scene"] in scenes):
            audio = tts.generate(spoken(line), sid=0, speed=1.0)
            samples = np.asarray(audio.samples, dtype=np.float32)
            samples *= 0.89 / max(1e-6, float(np.abs(samples).max()))  # peak -1 dBFS
            sf.write(wav, samples, audio.sample_rate)
        if wav.exists():
            info = sf.info(wav)
            manifest[line["id"]] = round(info.frames / info.samplerate, 3)
    (HERE.parent / "src" / "audio-durations.json").write_text(json.dumps(manifest, indent=1))
    print(f"{len(manifest)} lines, total {sum(manifest.values()):.1f}s")


if __name__ == "__main__":
    main()
