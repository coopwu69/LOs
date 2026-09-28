// Generate the Thai voice-over from src/narration.json.
//
//   pip install edge-tts      (once)
//   node scripts/tts.mjs      → public/voice/<scene>-<n>.mp3 + src/voice.json (durations)
//
// Uses Microsoft Edge's online neural TTS (edge-tts). Only the narration text
// is sent. Lines whose text+voice didn't change are not regenerated.

import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VOICE = process.env.TTS_VOICE ?? "th-TH-PremwadeeNeural";
const RATE = process.env.TTS_RATE ?? "+5%";
const OUT = path.join(ROOT, "public", "voice");
const META = path.join(ROOT, "src", "voice.json");

const narration = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "narration.json"), "utf8"));
const prev = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, "utf8")) : { lines: {} };
fs.mkdirSync(OUT, { recursive: true });

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", shell: process.platform === "win32" });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")}\n${r.stderr}`);
  return r.stdout;
};

function duration(file) {
  const out = run("npx", ["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `"${file}"`]);
  const s = parseFloat(out.trim().split(/\s+/).pop());
  if (!Number.isFinite(s)) throw new Error(`no duration for ${file}: ${out}`);
  return s;
}

const lines = {};
for (const [scene, texts] of Object.entries(narration)) {
  if (scene.startsWith("_")) continue;
  texts.forEach((text, i) => {
    const id = `${scene}-${i}`;
    const file = path.join(OUT, `${id}.mp3`);
    const hash = crypto.createHash("sha1").update(`${VOICE}|${RATE}|${text}`).digest("hex").slice(0, 12);
    if (prev.lines[id]?.hash === hash && fs.existsSync(file)) {
      lines[id] = prev.lines[id];
      return;
    }
    const txt = path.join(OUT, `${id}.txt`);
    fs.writeFileSync(txt, text, "utf8");
    // The online service occasionally returns no audio — retry with backoff.
    for (let attempt = 1; ; attempt++) {
      try {
        run("python", ["-m", "edge_tts", "--voice", VOICE, `--rate=${RATE}`, "--file", `"${txt}"`, "--write-media", `"${file}"`]);
        break;
      } catch (e) {
        if (attempt >= 12) throw e;
        console.log(`  ${id}  retry ${attempt}…`);
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500 * Math.min(attempt, 4));
      }
    }
    fs.rmSync(txt);
    lines[id] = { hash, seconds: Math.round(duration(file) * 1000) / 1000 };
    console.log(`  ${id}  ${lines[id].seconds}s`);
    // save progress so a later failure doesn't redo finished lines
    fs.writeFileSync(META, JSON.stringify({ voice: VOICE, rate: RATE, lines: { ...prev.lines, ...lines } }, null, 2));
  });
}

fs.writeFileSync(META, JSON.stringify({ voice: VOICE, rate: RATE, lines }, null, 2));
const total = Object.values(lines).reduce((a, l) => a + l.seconds, 0);
console.log(`\n${Object.keys(lines).length} lines, ${total.toFixed(1)}s of speech → src/voice.json`);
