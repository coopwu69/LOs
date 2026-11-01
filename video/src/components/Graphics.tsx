import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { Box, Cam, mapBox } from "./camera";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.out(Easing.cubic);

/** 0→1→0 envelope for an overlay shown between `from` and `to`. */
export const useWindow = (from: number, to: number, fade = 10) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return 0;
  return interpolate(f, [from, from + fade, to - fade, to], [0, 1, 1, 0], clamp);
};

export const Dim: React.FC<{ from: number; to: number; opacity?: number }> = ({ from, to, opacity = 0.55 }) => {
  const o = useWindow(from, to, 12);
  return o ? <AbsoluteFill style={{ background: C.navy, opacity: o * opacity }} /> : null;
};

/** Text bubble pointing at a UI element (page coords, follows the camera). */
export const Callout: React.FC<{
  from: number; to: number; box: Box; cam: Cam; text: React.ReactNode;
  place?: "above" | "below"; tone?: "navy" | "amber" | "red" | "green";
  /** "end": bubble's right edge aligns with the target's right edge (for targets near a side panel). */
  align?: "center" | "end";
}> = ({ from, to, box, cam, text, place = "below", tone = "navy", align = "center" }) => {
  const o = useWindow(from, to, 8);
  if (!o) return null;
  const b = mapBox(cam, box);
  const bg = { navy: C.navy, amber: C.amber, red: "#B42318", green: C.success }[tone];
  const fg = tone === "amber" ? C.navy : C.warmWhite;
  const cx = align === "end" ? b.x + b.w + 10 : b.x + b.w / 2;
  const y = place === "below" ? b.y + b.h + 22 : b.y - 22;
  return (
    <div style={{
      position: "absolute", left: cx, top: y, opacity: o,
      transform: `translate(${align === "end" ? "-100%" : "-50%"}, ${place === "below" ? 0 : -100}%) translateY(${(1 - o) * (place === "below" ? -10 : 10)}px)`,
      background: bg, color: fg, fontFamily: FONT, fontSize: 34, fontWeight: 600, padding: "12px 26px",
      borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(7,28,49,0.3)",
    }}>
      <div style={{
        position: "absolute", left: align === "end" ? "calc(100% - 40px)" : "50%", width: 18, height: 18, background: bg,
        transform: "translateX(-50%) rotate(45deg)", ...(place === "below" ? { top: -8 } : { bottom: -8 }),
      }} />
      <span style={{ position: "relative" }}>{text}</span>
    </div>
  );
};

/** Marks demo input so viewers never mistake it for a real reviewer. */
export const DemoBadge: React.FC<{ from: number; to: number; box: Box; cam: Cam }> = ({ from, to, box, cam }) => {
  const o = useWindow(from, to, 8);
  if (!o) return null;
  const b = mapBox(cam, box);
  return (
    <div style={{
      position: "absolute", left: b.x + b.w - 8, top: b.y + 8, transform: "translate(-100%, 0)", opacity: o,
      background: C.amber, color: C.navy, fontFamily: FONT, fontSize: 26, fontWeight: 700,
      padding: "6px 18px", borderRadius: 999, boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    }}>
      ข้อมูลสาธิต
    </div>
  );
};

export const DownloadChip: React.FC<{ from: number; to: number; filename: string }> = ({ from, to, filename }) => {
  const f = useCurrentFrame();
  const o = useWindow(from, to, 10);
  if (!o) return null;
  const progress = interpolate(f, [from, from + 24], [0, 1], clamp);
  return (
    <div style={{
      position: "absolute", right: 48, top: 40, width: 560, opacity: o, transform: `translateY(${(1 - o) * -20}px)`,
      background: "#fff", borderRadius: 18, padding: "22px 26px", fontFamily: FONT, color: C.navy,
      boxShadow: "0 18px 50px rgba(7,28,49,0.28)", border: "1px solid #E4E7EC", display: "flex", gap: 20, alignItems: "center",
    }}>
      <div style={{
        width: 64, height: 76, borderRadius: 8, background: "#2B579A", color: "#fff", fontSize: 34, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
      }}>W</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 30, fontWeight: 600 }}>{filename}</div>
        <div style={{ height: 8, background: "#EAECF0", borderRadius: 4, marginTop: 12, overflow: "hidden" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", background: C.success }} />
        </div>
        <div style={{ fontSize: 24, color: C.text2, marginTop: 8 }}>{progress < 1 ? "กำลังดาวน์โหลด…" : "ดาวน์โหลดเสร็จแล้ว"}</div>
      </div>
    </div>
  );
};

export const DocPreview: React.FC<{ from: number; to: number; pages: string[] }> = ({ from, to, pages }) => {
  const f = useCurrentFrame();
  const o = useWindow(from, to, 14);
  if (!o) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 140 }}>
      <div style={{ display: "flex", gap: 56, opacity: o }}>
        {pages.map((p, i) => {
          const s = interpolate(f, [from + i * 8, from + i * 8 + 18], [0, 1], { ...clamp, easing: easeOut });
          return (
            <Img key={p} src={staticFile(p)} style={{
              height: 760, borderRadius: 6, boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
              transform: `translateY(${(1 - s) * 60}px) rotate(${i === 0 ? -2 : 2}deg)`, opacity: s,
            }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{ title: string; sub?: string; accent?: string; width?: number; style?: React.CSSProperties }> = ({ title, sub, accent = C.navy, width = 420, style }) => (
  <div style={{
    width, background: C.warmWhite, borderRadius: 22, padding: "26px 30px", fontFamily: FONT, color: C.navy,
    borderTop: `10px solid ${accent}`, boxShadow: "0 18px 44px rgba(0,0,0,0.25)", ...style,
  }}>
    <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.35 }}>{title}</div>
    {sub && <div style={{ fontSize: 28, color: C.text2, marginTop: 10, lineHeight: 1.45 }}>{sub}</div>}
  </div>
);

/** One edit page feeds all three forms of the program (verified in the source code). */
export const SharedDiagram: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  const o = useWindow(from, to, 12);
  if (!o) return null;
  const forms = ["แบบประเมินจากสถานประกอบการ", "แบบประเมินจากอาจารย์นิเทศ", "แบบสอบถามนักศึกษา"];
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", paddingTop: 110 }}>
      <Card title="หน้าแก้ไขของหลักสูตร" sub="ผลลัพธ์การเรียนรู้ (LOs) + เกณฑ์คะแนน" accent={C.amber} width={640} style={{ textAlign: "center" }} />
      <svg width={1400} height={150} style={{ marginTop: 6 }}>
        {[-1, 0, 1].map((d, i) => {
          const p = interpolate(f, [from + 10 + i * 6, from + 30 + i * 6], [0, 1], clamp);
          const x2 = 700 + d * 470;
          return (
            <g key={d} opacity={p}>
              <line x1={700} y1={0} x2={700 + (x2 - 700) * p} y2={130 * p} stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", gap: 50 }}>
        {forms.map((t, i) => {
          const p = interpolate(f, [from + 24 + i * 6, from + 40 + i * 6], [0, 1], { ...clamp, easing: easeOut });
          return <Card key={t} title={t} width={420} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)`, textAlign: "center" }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

export const CompareCards: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const o = useWindow(from, to, 12);
  if (!o) return null;
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", paddingBottom: 150 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
        <Card title="บันทึกการแก้ไข" sub={"ปุ่ม “บันทึกการเปลี่ยนแปลง”\nในหน้าแก้ไข"} accent={C.amber} width={560} style={{ whiteSpace: "pre-line" }} />
        <div style={{ fontFamily: FONT, fontSize: 120, fontWeight: 700, color: C.warmWhite }}>≠</div>
        <Card title="ยืนยันการตรวจสอบ" sub={"ปุ่ม “ยืนยันว่าตรวจสอบแล้ว”\nในหน้าตรวจสอบ ทำแยกทีละฉบับ"} accent={C.success} width={560} style={{ whiteSpace: "pre-line" }} />
      </div>
    </AbsoluteFill>
  );
};

export const MeetingLoop: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  const o = useWindow(from, to, 12);
  if (!o) return null;
  const steps = [
    { t: "ดาวน์โหลด Word", c: "#2B579A" },
    { t: "พิมพ์ / ประชุม", c: C.text2 },
    { t: "แก้ไขและบันทึกในระบบ", c: C.amber },
    { t: "ยืนยันการตรวจสอบ", c: C.success },
  ];
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", paddingBottom: 150 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {steps.map((s, i) => {
          const p = interpolate(f, [from + i * 10, from + i * 10 + 14], [0, 1], { ...clamp, easing: easeOut });
          return (
            <React.Fragment key={s.t}>
              {i > 0 && <div style={{ fontSize: 60, color: C.warmWhite, opacity: p, fontFamily: FONT }}>→</div>}
              <Card title={s.t} accent={s.c} width={360} style={{ opacity: p, transform: `scale(${0.9 + 0.1 * p})`, textAlign: "center" }} />
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
