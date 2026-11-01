// Builds an SRT from the same inputs as src/timeline.ts (mirror of buildScene).
// Usage: node scripts/make-srt.mjs <out.srt> <scene,scene,...> [maxFrames]
import { readFileSync, writeFileSync } from "node:fs";

const FPS = 30;
const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const durations = read("../src/audio-durations.json");
const spec = read("../src/timeline-spec.json");
const text = Object.fromEntries(read("../narration/narration.json").map((l) => [l.id, l.text]));

function buildScene(s) {
  let cursor = s.lead;
  const order = [];
  for (const l of s.lines) {
    const start = cursor + (l.pre ?? 0);
    const len = Math.ceil((durations[l.id] ?? 2) * FPS);
    order.push({ id: l.id, start, end: start + len });
    cursor = start + len + s.gap;
  }
  return { duration: cursor - s.gap + s.tail, order };
}

const [out = "out/tutorial.srt", scenesArg = "1,2,3,4,5,6,7", maxArg] = process.argv.slice(2);
const maxFrames = maxArg ? Number(maxArg) : Infinity;
const ts = (f) => {
  const ms = Math.round((f / FPS) * 1000);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

let offset = 0;
const cues = [];
for (const n of scenesArg.split(",").map(Number)) {
  const s = spec.find((x) => x.scene === n);
  if (!s) throw new Error(`scene ${n} missing from timeline-spec.json`);
  const b = buildScene(s);
  for (const l of b.order) {
    const start = offset + l.start;
    if (start >= maxFrames) break;
    cues.push({ start, end: Math.min(offset + l.end + 6, maxFrames), text: text[l.id] });
  }
  offset += b.duration;
}
writeFileSync(out, cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join("\n"));
console.log(`${cues.length} cues -> ${out}`);
