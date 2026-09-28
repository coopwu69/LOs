import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fadeInOut, hasVoice } from "./engine";
import { C, FONT } from "./theme";

// ---------------------------------------------------------------------------
// Full-frame explainer cards (no screenshot). Each item enters on a stagger.
// ---------------------------------------------------------------------------

const useEnter = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 120 } });
  return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [36, 0])}px)` };
};

const Frame: React.FC<{ duration: number; children: React.ReactNode; light?: boolean }> = ({ duration, children, light }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        opacity: fadeInOut(frame, duration, 12),
        background: light
          ? `linear-gradient(160deg, ${C.cream} 0%, ${C.sunken} 100%)`
          : `radial-gradient(ellipse at 25% 15%, ${C.navy700} 0%, ${C.navy} 70%)`,
        color: light ? C.navy : C.cream,
        padding: "110px 150px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div style={{ ...useEnter(delay), display: "inline-flex", alignSelf: "flex-start", padding: "10px 24px", borderRadius: 999, background: C.accent, color: C.navy, fontWeight: 700, fontSize: 30 }}>
    {children}
  </div>
);

const Title: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({ children, delay = 4, size = 68 }) => (
  <div style={{ ...useEnter(delay), fontWeight: 700, fontSize: size, lineHeight: 1.3, marginTop: 26 }}>{children}</div>
);

/** Voice lines "<scene>-<i>" starting at the given frames (see planCard). */
export const VoiceTrack: React.FC<{ scene: string; at: number[] }> = ({ scene, at }) => (
  <>
    {at.map((f, i) => {
      const id = `${scene}-${i}`;
      return hasVoice(id) ? (
        <Sequence key={id} from={f} layout="none">
          <Audio src={staticFile(`voice/${id}.mp3`)} />
        </Sequence>
      ) : null;
    })}
  </>
);

// ---------------------------------------------------------------------------

export const Intro: React.FC<{ duration: number; minutes?: number }> = ({ duration, minutes = 4 }) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [20, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Frame duration={duration}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
        <div style={{ ...useEnter(0), fontSize: 34, fontWeight: 500, color: "rgba(255,254,251,.75)" }}>
          ศูนย์สหกิจศึกษาและพัฒนาอาชีพ · มหาวิทยาลัยวลัยลักษณ์
        </div>
        <div style={{ ...useEnter(6), fontWeight: 700, fontSize: 84, lineHeight: 1.3, marginTop: 28 }}>
          ระบบตรวจสอบแบบประเมิน
          <br />
          ผลลัพธ์การเรียนรู้รายวิชาสหกิจศึกษา
        </div>
        <div style={{ height: 8, width: 520 * bar, background: C.accent, borderRadius: 4, marginTop: 40 }} />
        <div style={{ ...useEnter(24), fontSize: 40, marginTop: 40, color: C.cream }}>
          วิดีโอสอนการใช้งาน สำหรับอาจารย์และผู้รับผิดชอบหลักสูตร
        </div>
        <div style={{ ...useEnter(32), fontSize: 30, marginTop: 18, color: "rgba(255,254,251,.7)" }}>
          ความยาวประมาณ {minutes} นาที · ทำตามได้ทันทีโดยไม่ต้องเคยใช้ระบบมาก่อน
        </div>
      </div>
    </Frame>
  );
};

// Explicit lines: Chrome's Thai segmentation splits some words (e.g. สหกิจ).
const FORMS = [
  { who: "สถานประกอบการ", name: ["แบบประเมินผลการปฏิบัติสหกิจศึกษา", "จากสถานประกอบการ"], by: "พี่เลี้ยง / หัวหน้างาน", icon: "🏢" },
  { who: "อาจารย์นิเทศ", name: ["แบบประเมินนักศึกษาสหกิจศึกษา", "จากอาจารย์นิเทศ"], by: "อาจารย์ที่ไปนิเทศ", icon: "👩‍🏫" },
  { who: "นักศึกษา", name: ["แบบสอบถามนักศึกษาหลังกลับ", "จากการปฏิบัติงานสหกิจศึกษา"], by: "นักศึกษาสหกิจศึกษา", icon: "🎓" },
];

const Lines: React.FC<{ lines: string[] }> = ({ lines }) => (
  <>
    {lines.map((l) => (
      <div key={l} style={{ whiteSpace: "nowrap" }}>
        {l}
      </div>
    ))}
  </>
);

export const WhatIs: React.FC<{ duration: number }> = ({ duration }) => (
  <Frame duration={duration} light>
    <Kicker>ระบบนี้คืออะไร</Kicker>
    <Title size={56}>แต่ละหลักสูตรมีแบบฟอร์ม 3 ฉบับ — ท่านช่วยตรวจว่าคำถามครบและถูกต้อง ก่อนนำไปใช้จริง</Title>
    <div style={{ display: "flex", gap: 36, marginTop: 56 }}>
      {FORMS.map((f, i) => (
        <div
          key={f.who}
          style={{
            ...useEnter(20 + i * 10),
            flex: 1,
            background: C.cream,
            border: `2px solid ${C.border}`,
            borderRadius: 28,
            padding: "36px 36px 40px",
            boxShadow: "0 16px 40px rgba(7,28,49,.08)",
          }}
        >
          <div style={{ fontSize: 64 }}>{f.icon}</div>
          <div style={{ fontSize: 26, color: C.text2, marginTop: 14 }}>ฟอร์มที่ {i + 1}</div>
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 2 }}>{f.who}</div>
          <div style={{ fontSize: 25, lineHeight: 1.5, color: C.text2, marginTop: 14 }}>
            <Lines lines={f.name} />
          </div>
          <div style={{ fontSize: 25, color: C.navy, marginTop: 16, fontWeight: 600, whiteSpace: "nowrap" }}>กรอกโดย{f.by}</div>
        </div>
      ))}
    </div>
    <div style={{ ...useEnter(56), marginTop: 44, display: "flex", gap: 24, fontSize: 30 }}>
      <Pill>คำถามหลัก (LOs) เป็นชุดเดียวกันทั้ง 3 ฟอร์ม</Pill>
      <Pill>ไม่เก็บคำตอบจริง · ไม่ต้องล็อกอิน</Pill>
    </div>
  </Frame>
);

const Pill: React.FC<{ children: React.ReactNode; tone?: "navy" | "warn" }> = ({ children, tone = "navy" }) => (
  <div
    style={{
      padding: "14px 26px",
      borderRadius: 999,
      background: tone === "warn" ? C.warningBg : C.navy100,
      color: tone === "warn" ? C.warning : C.navy,
      fontWeight: 600,
    }}
  >
    {children}
  </div>
);

const FLOW = [
  { icon: "⬇️", t: "ดาวน์โหลด", d: ["ไฟล์ Word (.docx)", "ของฟอร์มนั้น"] },
  { icon: "✏️", t: "แก้ไขในไฟล์", d: ["แก้ข้อความ หรือ", "ใส่หมายเหตุจุดที่ผิด"] },
  { icon: "📨", t: "ส่งกลับศูนย์ฯ", d: ["ทางอีเมลหรือไลน์", "ระบุหลักสูตรและฟอร์ม"] },
  { icon: "🔁", t: "ตรวจอีกครั้ง", d: ["เมื่อศูนย์ฯ แก้ในระบบแล้ว", "จึงกดยืนยัน"] },
];

export const ErrorFlow: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  return (
    <Frame duration={duration} light>
      <Kicker>ถ้าพบข้อผิดพลาด</Kicker>
      <Title size={60}>อย่ากดยืนยันฟอร์มนั้น — ทำตามนี้แทน</Title>
      <div style={{ display: "flex", alignItems: "stretch", marginTop: 70 }}>
        {FLOW.map((f, i) => {
          const arrow = interpolate(frame, [30 + i * 18, 44 + i * 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <React.Fragment key={f.t}>
              <div style={{ ...useEnter(14 + i * 18), flex: 1, background: C.cream, border: `2px solid ${C.border}`, borderRadius: 26, padding: "34px 28px", textAlign: "center" }}>
                <div style={{ fontSize: 70 }}>{f.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 700, marginTop: 16, whiteSpace: "nowrap" }}>{f.t}</div>
                <div style={{ fontSize: 25, color: C.text2, marginTop: 10, lineHeight: 1.5 }}>
                  <Lines lines={f.d} />
                </div>
              </div>
              {i < FLOW.length - 1 && (
                <div style={{ width: 70, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, color: C.accent, opacity: arrow }}>➜</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ ...useEnter(100), marginTop: 50, fontSize: 30, color: C.text2 }}>
        ผู้ตรวจไม่สามารถแก้คำถามบนหน้าเว็บได้ — การแก้เนื้อหาทำผ่านไฟล์ Word เท่านั้น
      </div>
    </Frame>
  );
};

export const Outro: React.FC<{ duration: number }> = ({ duration }) => (
  <Frame duration={duration}>
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
      <div style={{ ...useEnter(0), fontSize: 80, fontWeight: 700 }}>ขอบคุณที่ช่วยตรวจสอบ 🙏</div>
      <div style={{ ...useEnter(10), fontSize: 38, marginTop: 30, lineHeight: 1.6, color: "rgba(255,254,251,.88)" }}>
        ยืนยันให้ครบทั้ง 3 ฟอร์ม ถือว่างานตรวจสอบของหลักสูตรเสร็จสมบูรณ์
      </div>
      <div style={{ ...useEnter(20), display: "flex", gap: 24, marginTop: 50, fontSize: 32 }}>
        <div style={{ padding: "18px 30px", borderRadius: 20, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)" }}>
          📘 อ่านคู่มือฉบับเต็ม: ปุ่ม <b style={{ color: C.accent }}>“คู่มือการใช้งานระบบ”</b> บนทุกหน้า (มีฉบับ PDF)
        </div>
      </div>
      <div style={{ ...useEnter(30), fontSize: 30, marginTop: 30, color: "rgba(255,254,251,.7)" }}>
        สอบถามเพิ่มเติม: ศูนย์สหกิจศึกษาและพัฒนาอาชีพ มหาวิทยาลัยวลัยลักษณ์
      </div>
    </div>
  </Frame>
);
