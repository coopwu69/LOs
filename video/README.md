# วิดีโอสอนใช้งาน — ระบบตรวจสอบแบบประเมินผลลัพธ์การเรียนรู้รายวิชาสหกิจศึกษา

Remotion project (1920×1080, 30 fps). Screens are captured from a **local replica** of `web/`,
never from the live site, so demo edits and confirmations never touch production data.

## Pipeline

| Step | Command | Output |
|---|---|---|
| 1. Local DB + app | see "Local replica" below | `http://127.0.0.1:3100` |
| 2. Capture screens | `npm run capture` | `public/shots/*.png` (2× DPR), `src/shots.json` (click/zoom target boxes) |
| 3. Voice | `npm run voice` | `public/audio/<id>.wav`, `src/audio-durations.json` |
| 4. Preview in studio | `npm run studio` | — |
| 5. Render | `npm run render:full` (or `render:preview`) | `out/tutorial.mp4` + `out/tutorial.srt` |

Compositions: `Tutorial` (full), `Scene1`…`Scene7` (one scene each, for review), `Preview`, `VoiceSample`.

| Scene | Content | Source of screens |
|---|---|---|
| 1 | Intro: pilot 2/2569, in use 2570 | graphics |
| 2 | Open school link, search, pick program | replica |
| 3 | Review page, 3 forms, "ดู", checklist | replica |
| 4 | "แก้ไข" → fix a demo typo → save dialog → saved; shared LOs; save ≠ confirm | replica (save done on local copy) |
| 5 | "ดาวน์โหลด" → real Word file rendered | replica + LibreOffice |
| 6 | "ยืนยันว่าตรวจสอบแล้ว" dialog → "ตรวจแล้ว" | replica (confirm done on local copy) |
| 7 | Summary | graphics |

## Where to edit

- **Narration + captions:** `narration/narration.json` — `text` is what appears on screen/SRT, `say` (optional) is what the voice reads (numbers and Latin words spelled out in Thai).
- **Timing:** `src/timeline-spec.json` — per scene: `lead`, `gap`, `tail`, and `pre` (extra pause before a line, for clicks/page changes). Scene length follows the audio automatically.
- **Choreography:** `src/scenes/SceneN.tsx` — which screenshot, camera zoom, highlight box, and cursor move happen on which narration line.
- **Look:** `src/theme.ts` (colors from `web/src/app/globals.css`, IBM Plex Sans Thai Looped).

## Replacing the draft voice

The current voice is Meta MMS-TTS Thai (offline, via sherpa-onnx) — a draft. To use a human or
professional TTS recording: save one WAV per narration id into `public/audio/` (same ids), then run
`python3 narration/synth.py --measure-only` to refresh durations. Timing, captions and SRT follow.

## Capture prerequisites

`libreoffice-writer` and the TH Sarabun New font (`web/src/assets/fonts/THSarabunNew*.ttf` copied
into `/usr/local/share/fonts` + `fc-cache -f`) so the Word page renders as it does in Word;
`pip install pymupdf` for the PDF → PNG step.

## Local replica

```bash
# Postgres 16 on :5433 with SSL (the app forces SSL), schema from migrations/neon + 004–024
video/replica/setup-db.sh                # Postgres 16 on :5433 + schema + seed
python3 video/replica/seed.py --typo     # (capture.mjs re-runs this) 4 programs of สำนักวิชาการจัดการ; LOG = production rubric snapshot
cd web && DATABASE_URL=postgresql://postgres@127.0.0.1:5433/los npx next dev -p 3100
```

LOG content comes from `migrations/g11_batches/batch_4_rewritten.json` (production snapshot, final
4-level rubric). Names of the other 3 programs are taken from the source-document titles and may differ
slightly from the live site.
