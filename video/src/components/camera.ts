import { Easing, interpolate } from "remotion";
import { H, W } from "../theme";

export type Box = { x: number; y: number; w: number; h: number };
export type Cam = { s: number; tx: number; ty: number };
export type CamKey = {
  at: number;
  focus?: Box | null; // null/undefined = full screen
  into?: Box; // screen region the focus should fill (default: whole frame)
  pad?: number;
  maxZoom?: number;
  dur?: number;
};

const FULL: Cam = { s: 1, tx: 0, ty: 0 };
// Default zoom target keeps the caption band (bottom ~160px) free of focused content.
export const SAFE: Box = { x: 0, y: 0, w: W, h: 910 };
const ease = Easing.inOut(Easing.cubic);

export function union(...boxes: Box[]): Box {
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  const r = Math.max(...boxes.map((b) => b.x + b.w));
  const b = Math.max(...boxes.map((bb) => bb.y + bb.h));
  return { x, y, w: r - x, h: b - y };
}

function camFor(k: CamKey): Cam {
  if (!k.focus) return FULL;
  const pad = k.pad ?? 60;
  const into = k.into ?? SAFE;
  const f = k.focus;
  const s = Math.max(1, Math.min(into.w / (f.w + pad * 2), into.h / (f.h + pad * 2), k.maxZoom ?? 2.2));
  let tx = into.x + into.w / 2 - (f.x + f.w / 2) * s;
  let ty = into.y + into.h / 2 - (f.y + f.h / 2) * s;
  // Keep the screenshot covering the frame, except when aiming at a sub-region
  // (e.g. left of a side panel) where exact placement matters more.
  if (!k.into) {
    tx = Math.min(0, Math.max(W - W * s, tx));
    ty = Math.min(0, Math.max(H - H * s, ty));
  }
  return { s, tx, ty };
}

export function camAt(keys: CamKey[], frame: number): Cam {
  let idx = -1;
  while (idx + 1 < keys.length && keys[idx + 1].at <= frame) idx++;
  if (idx < 0) return FULL;
  const active = keys[idx];
  // Start from wherever the camera actually was when this key began (it may
  // still have been mid-move toward the previous key).
  const prev = idx > 0 ? camAt(keys.slice(0, idx), active.at) : FULL;
  const cur = camFor(active);
  const t = interpolate(frame, [active.at, active.at + (active.dur ?? 22)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return { s: prev.s + (cur.s - prev.s) * t, tx: prev.tx + (cur.tx - prev.tx) * t, ty: prev.ty + (cur.ty - prev.ty) * t };
}

export const mapBox = (c: Cam, b: Box): Box => ({ x: b.x * c.s + c.tx, y: b.y * c.s + c.ty, w: b.w * c.s, h: b.h * c.s });
export const mapPt = (c: Cam, x: number, y: number) => ({ x: x * c.s + c.tx, y: y * c.s + c.ty });
