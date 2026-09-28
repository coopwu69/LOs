import { Easing, interpolate } from "remotion";
import shotsJson from "./shots.json";
import voiceJson from "./voice.json";
import { H, W } from "./theme";

// ---------------------------------------------------------------------------
// Coordinates: "world" = CSS px of the 1600×900 capture viewport. The browser
// card draws a 44px address bar ABOVE world y=0.
// ---------------------------------------------------------------------------

export type Rect = { x: number; y: number; w: number; h: number };
export type Pt = { x: number; y: number };

type ShotRects = Record<string, Record<string, Rect | null>>;
const RECTS = (shotsJson as unknown as { rects: ShotRects }).rects;

export const VIEW_W = 1600;
export const VIEW_H = 900;
export const BAR_H = 44;

/** Rect of a captured element, e.g. r("review", "confirm1"). */
export function r(shot: string, key: string): Rect {
  const rect = RECTS[shot]?.[key];
  if (!rect) throw new Error(`missing rect ${shot}.${key} — re-run scripts/capture.mjs`);
  return rect;
}

export const FULL: Rect = { x: -24, y: -BAR_H - 16, w: VIEW_W + 48, h: VIEW_H + BAR_H + 40 };

export const center = (a: Rect): Pt => ({ x: a.x + a.w / 2, y: a.y + a.h / 2 });
export const pad = (a: Rect, p: number): Rect => ({ x: a.x - p, y: a.y - p, w: a.w + p * 2, h: a.h + p * 2 });
export const union = (...rs: Rect[]): Rect => {
  const x1 = Math.min(...rs.map((a) => a.x));
  const y1 = Math.min(...rs.map((a) => a.y));
  const x2 = Math.max(...rs.map((a) => a.x + a.w));
  const y2 = Math.max(...rs.map((a) => a.y + a.h));
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
};

// The caption card occupies the bottom of the frame, so the camera frames
// targets inside the area above it.
export const SAFE = { x: 0, y: 0, w: W, h: H - 250 };

export type Camera = { s: number; tx: number; ty: number };

export function cameraFor(focus: Rect, maxScale = 2.2): Camera {
  const s = Math.min((SAFE.w * 0.92) / focus.w, (SAFE.h * 0.9) / focus.h, maxScale);
  const c = center(focus);
  let tx = SAFE.x + SAFE.w / 2 - c.x * s;
  let ty = SAFE.y + SAFE.h / 2 - c.y * s;
  // When zoomed in, don't pan past the page edges (no empty background showing).
  if (VIEW_W * s >= W) tx = Math.min(0, Math.max(W - VIEW_W * s, tx));
  if ((VIEW_H + BAR_H) * s >= SAFE.h) ty = Math.min(BAR_H * s, Math.max(SAFE.h - VIEW_H * s, ty));
  return { s, tx, ty };
}

export const toScreen = (cam: Camera, p: Pt): Pt => ({ x: p.x * cam.s + cam.tx, y: p.y * cam.s + cam.ty });
export const rectToScreen = (cam: Camera, a: Rect): Rect => ({
  x: a.x * cam.s + cam.tx,
  y: a.y * cam.s + cam.ty,
  w: a.w * cam.s,
  h: a.h * cam.s,
});

// ---------------------------------------------------------------------------
// Tracks: a list of keyframes {at, value}; the value eases from the previous
// keyframe's value over `dur` frames starting at `at`.
// ---------------------------------------------------------------------------

export type Key<T> = { at: number; value: T; dur?: number };

const ease = Easing.bezier(0.45, 0, 0.2, 1);

export function track<T>(keys: Key<T>[], frame: number, lerp: (a: T, b: T, t: number) => T): T {
  if (keys.length === 0) throw new Error("empty track");
  let i = -1;
  for (let k = 0; k < keys.length; k++) if (keys[k].at <= frame) i = k;
  if (i <= 0) return keys[0].value;
  const cur = keys[i];
  const prev = keys[i - 1].value;
  const dur = cur.dur ?? 22;
  const t = ease(Math.min(1, (frame - cur.at) / dur));
  return lerp(prev, cur.value, t);
}

export const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerpN(a.x, b.x, t),
  y: lerpN(a.y, b.y, t),
  w: lerpN(a.w, b.w, t),
  h: lerpN(a.h, b.h, t),
});
export const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({ x: lerpN(a.x, b.x, t), y: lerpN(a.y, b.y, t) });

/** Camera interpolated in log-scale space so zooms feel even. */
export function cameraAt(keys: Key<Rect>[], frame: number): Camera {
  let i = -1;
  for (let k = 0; k < keys.length; k++) if (keys[k].at <= frame) i = k;
  if (i <= 0) return cameraFor(keys[0].value);
  const a = cameraFor(keys[i - 1].value);
  const b = cameraFor(keys[i].value);
  const t = ease(Math.min(1, (frame - keys[i].at) / (keys[i].dur ?? 26)));
  const s = Math.exp(lerpN(Math.log(a.s), Math.log(b.s), t));
  // interpolate the world point at the safe-area centre, then rebuild tx/ty
  const ca = { x: (SAFE.w / 2 - a.tx) / a.s, y: (SAFE.h / 2 - a.ty) / a.s };
  const cb = { x: (SAFE.w / 2 - b.tx) / b.s, y: (SAFE.h / 2 - b.ty) / b.s };
  const c = lerpPt(ca, cb, t);
  return { s, tx: SAFE.w / 2 - c.x * s, ty: SAFE.h / 2 - c.y * s };
}

export const fadeInOut = (frame: number, total: number, len = 12) =>
  interpolate(frame, [0, len, total - len, total], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const sec = (s: number) => Math.round(s * 30);

// ---------------------------------------------------------------------------
// Voice-over timing. src/voice.json is written by scripts/tts.mjs.
//
// A screen scene is split into segments at its caption times; caption i is
// voiced by line "<scene>-<i>". When a line is longer than its segment, the
// segment is extended by HOLDING its last frame (animations keep their normal
// speed, the picture simply waits for the narrator). Keep transitions from
// straddling a caption boundary, or they would freeze half-way.
// ---------------------------------------------------------------------------

const VOICE = (voiceJson as { lines: Record<string, { seconds: number }> }).lines;

export const LEAD = 6; // frames between caption appearing and voice starting
export const TAIL = 14; // breathing room after a line

export const voiceFrames = (id: string) => (VOICE[id] ? Math.ceil(VOICE[id].seconds * 30) : 0);
export const hasVoice = (id: string) => Boolean(VOICE[id]);

export type Seg = { o0: number; oLen: number; n0: number; nLen: number };

export function planScene(starts: number[], duration: number, scene: string) {
  const segs: Seg[] = [];
  let n = 0;
  starts.forEach((s, i) => {
    const last = i === starts.length - 1;
    const oLen = (last ? duration : starts[i + 1]) - s;
    const v = voiceFrames(`${scene}-${i}`);
    const need = v ? LEAD + v + TAIL + (last ? 16 : 0) : 0;
    const nLen = Math.max(oLen, need);
    segs.push({ o0: s, oLen, n0: n, nLen });
    n += nLen;
  });
  return { segs, total: n };
}

/** Real (output) frame → script frame used by all keyframes. */
export function toScript(segs: Seg[], real: number): number {
  let seg = segs[segs.length - 1];
  for (const s of segs) if (real < s.n0 + s.nLen) { seg = s; break; }
  return seg.o0 + Math.min(real - seg.n0, seg.oLen - 1);
}

/** Card scenes: lines play back-to-back from `start`. */
export function planCard(scene: string, count: number, minDuration: number, start = 15, gap = 12) {
  const at: number[] = [];
  let t = start;
  for (let i = 0; i < count; i++) {
    at.push(t);
    t += voiceFrames(`${scene}-${i}`) + gap;
  }
  return { at, total: Math.max(minDuration, t + TAIL + 16) };
}
