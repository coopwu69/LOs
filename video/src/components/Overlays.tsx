import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, H, W } from "../theme";
import { Box, Cam, mapBox, mapPt } from "./camera";
import shots from "../shots.json";

type ShotName = keyof typeof shots;
export const shotBox = (shot: ShotName, key: string): Box =>
  (shots[shot].boxes as Record<string, Box>)[key];

// ---------- Screenshots with crossfade ----------
export type ShotKey = { at: number; shot: ShotName; fade?: number };

export const ShotTrack: React.FC<{ keys: ShotKey[]; cam: Cam }> = ({ keys, cam }) => {
  const frame = useCurrentFrame();
  const visible = keys.filter((k) => k.at <= frame);
  const cur = visible[visible.length - 1] ?? keys[0];
  const prev = visible.length > 1 ? visible[visible.length - 2] : null;
  const fade = cur.fade ?? 8;
  const o = interpolate(frame, [cur.at, cur.at + fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const style: React.CSSProperties = {
    position: "absolute", left: 0, top: 0, width: W, height: H,
    transformOrigin: "0 0", transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: C.page, overflow: "hidden" }}>
      {prev && o < 1 ? <Img src={staticFile(shots[prev.shot].file)} style={style} /> : null}
      <Img src={staticFile(shots[cur.shot].file)} style={{ ...style, opacity: prev ? o : 1 }} />
    </AbsoluteFill>
  );
};

// ---------- Highlight frame ----------
export type HL = { from: number; to: number; box: Box; pad?: number };

export const Highlights: React.FC<{ items: HL[]; cam: Cam }> = ({ items, cam }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {items.map((h, i) => {
        if (frame < h.from || frame > h.to) return null;
        const o = interpolate(frame, [h.from, h.from + 8, h.to - 8, h.to], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const grow = interpolate(frame, [h.from, h.from + 10], [1.04, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        const p = h.pad ?? 10;
        const b = mapBox(cam, { x: h.box.x - p, y: h.box.y - p, w: h.box.w + p * 2, h: h.box.h + p * 2 });
        return (
          <div key={i} style={{
            position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, opacity: o,
            transform: `scale(${grow})`, borderRadius: 14, border: `4px solid ${C.amber}`,
            boxShadow: `0 0 0 6px ${C.amberSoft}, 0 8px 30px rgba(7,28,49,0.18)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Mouse cursor ----------
export type CursorKey = { at: number; x: number; y: number; dur?: number; click?: boolean };
const easeMove = Easing.inOut(Easing.cubic);

export const Cursor: React.FC<{ keys: CursorKey[]; cam: Cam; hideAfter?: number }> = ({ keys, cam, hideAfter }) => {
  const frame = useCurrentFrame();
  if (!keys.length || frame < keys[0].at || (hideAfter !== undefined && frame > hideAfter)) return null;
  let x = keys[0].x;
  let y = keys[0].y;
  let clickAt: number | null = null;
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (frame < k.at) break;
    const d = k.dur ?? 20;
    const t = interpolate(frame, [k.at, k.at + d], [0, 1], { extrapolateRight: "clamp", easing: easeMove });
    x = x + (k.x - x) * t;
    y = y + (k.y - y) * t;
    if (k.click && frame >= k.at + d) clickAt = k.at + d;
  }
  const p = mapPt(cam, x, y);
  const since = clickAt === null ? 99 : frame - clickAt;
  const press = since < 6 ? 0.85 : 1;
  const ripple = since < 18 ? since / 18 : null;
  const appear = interpolate(frame, [keys[0].at, keys[0].at + 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {ripple !== null && (
        <div style={{
          position: "absolute", left: p.x - 40 * (0.4 + ripple), top: p.y - 40 * (0.4 + ripple),
          width: 80 * (0.4 + ripple), height: 80 * (0.4 + ripple), borderRadius: "50%",
          border: `4px solid ${C.amber}`, opacity: 1 - ripple,
        }} />
      )}
      <svg width={44} height={44} viewBox="0 0 24 24" style={{
        position: "absolute", left: p.x - 5, top: p.y - 3, opacity: appear,
        transform: `scale(${press})`, transformOrigin: "5px 3px", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.35))",
      }}>
        <path d="M5 3 L5 20 L9.5 15.8 L12.6 22 L15.4 20.7 L12.4 14.6 L18.5 14.4 Z" fill="#fff" stroke="#0b1320" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Captions ----------
export type CaptionLine = { start: number; end: number; text: string; top?: boolean };

export const Captions: React.FC<{ lines: CaptionLine[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const cur = lines.find((l) => frame >= l.start && frame <= l.end + 6);
  if (!cur) return null;
  const o = interpolate(frame, [cur.start, cur.start + 5, cur.end + 1, cur.end + 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center",
      ...(cur.top ? { top: 120 } : { bottom: 48 }), opacity: o, pointerEvents: "none",
    }}>
      <div style={{
        maxWidth: 1500, padding: "16px 36px 20px", borderRadius: 16, background: "rgba(7,28,49,0.88)",
        color: C.warmWhite, fontFamily: FONT, fontSize: 44, fontWeight: 500, lineHeight: 1.5, textAlign: "center",
        textWrap: "balance",
      } as React.CSSProperties}>
        {cur.text}
      </div>
    </div>
  );
};
