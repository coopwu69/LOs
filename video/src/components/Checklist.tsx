import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";

export const CHECKLIST_WIDTH = 520;

export const Checklist: React.FC<{ from: number; to: number; items: { text: string; at: number }[] }> = ({ from, to, items }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to) return null;
  const slide = interpolate(frame, [from, from + 16, to - 12, to], [1, 0, 0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div style={{
      position: "absolute", right: 40, top: 150, width: CHECKLIST_WIDTH, transform: `translateX(${slide * 620}px)`,
      background: C.warmWhite, borderRadius: 24, padding: "30px 32px", fontFamily: FONT, color: C.navy,
      boxShadow: "0 20px 50px rgba(7,28,49,0.25)", border: `2px solid ${C.navy}`,
    }}>
      <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 18 }}>สิ่งที่ต้องตรวจ</div>
      {items.map((it, i) => {
        const on = frame >= it.at;
        const pop = interpolate(frame, [it.at, it.at + 10], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
        const active = on && (i === items.length - 1 || frame < items[i + 1].at);
        return (
          <div key={i} style={{
            display: "flex", gap: 16, alignItems: "flex-start", padding: "14px 12px", borderRadius: 14, marginBottom: 6,
            background: active ? "rgba(245,158,11,0.14)" : "transparent", opacity: on ? 1 : 0.45,
          }}>
            <div style={{
              flex: "0 0 40px", height: 40, borderRadius: 10, marginTop: 4,
              border: `3px solid ${on ? C.success : "#98A2B3"}`, background: on ? C.success : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? pop : 1})`,
            }}>
              {on && <svg width={26} height={26} viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <div style={{ fontSize: 30, lineHeight: 1.45, fontWeight: active ? 600 : 500 }}>{it.text}</div>
          </div>
        );
      })}
    </div>
  );
};
