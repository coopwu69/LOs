import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SCENES } from "../timeline";
import { C, FONT } from "../theme";
import { Narration } from "../components/SceneShell";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rise = (f: number, at: number, d = 16) => interpolate(f, [at, at + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

const NavyBg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{
    background: `radial-gradient(1200px 700px at 50% 30%, ${C.navy700}, ${C.navy})`,
    fontFamily: FONT, color: C.warmWhite,
  }}>
    {children}
  </AbsoluteFill>
);

// ---------- Scene 1: intro ----------
const t1 = SCENES[1];
const L1 = t1.lines;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const out = interpolate(f, [t1.duration - 14, t1.duration], [1, 0], clamp);
  const title = rise(f, 4, 20);
  const n1 = rise(f, L1["1b"].start);
  const n2 = rise(f, L1["1c"].start);
  const card = rise(f, L1["1d"].start);
  const note = rise(f, L1["1e"].start);
  return (
    <NavyBg>
      <AbsoluteFill style={{ opacity: out, alignItems: "center", paddingTop: 120 }}>
        <div style={{ opacity: title, transform: `translateY(${(1 - title) * 30}px)`, textAlign: "center" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.3 }}>ระบบตรวจสอบแบบประเมินผลลัพธ์การเรียนรู้</div>
          <div style={{ fontSize: 56, fontWeight: 600, lineHeight: 1.4, color: C.amber }}>รายวิชาสหกิจศึกษา</div>
          <div style={{ fontSize: 34, fontWeight: 500, marginTop: 10, opacity: 0.85 }}>มหาวิทยาลัยวลัยลักษณ์</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 70 }}>
          {[
            { p: n1, top: "ทดลองใช้", sub: "ภาคเรียนที่ 2 ปีการศึกษา 2569" },
            { p: n2, top: "เริ่มใช้", sub: "ปีการศึกษา 2570" },
          ].map((n, i) => (
            <React.Fragment key={n.top}>
              {i === 1 && <div style={{ width: 220 * n2, height: 6, background: C.amber, borderRadius: 3, margin: "0 10px" }} />}
              <div style={{ opacity: n.p, transform: `scale(${0.85 + 0.15 * n.p})`, textAlign: "center", width: 480 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.amber, margin: "0 auto 14px", boxShadow: `0 0 0 10px rgba(245,158,11,0.25)` }} />
                <div style={{ fontSize: 40, fontWeight: 700 }}>{n.top}</div>
                <div style={{ fontSize: 32, opacity: 0.9 }}>{n.sub}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div style={{
          marginTop: 56, opacity: card, transform: `translateY(${(1 - card) * 24}px)`, background: C.warmWhite, color: C.navy,
          borderRadius: 22, padding: "24px 44px", textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        }}>
          <div style={{ fontSize: 38, fontWeight: 700 }}>งานของท่าน: ตรวจสอบและยืนยันเนื้อหาแบบประเมินล่วงหน้า</div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#B45309", marginTop: 8, opacity: note }}>ยังไม่ต้องประเมินนักศึกษาจริง</div>
        </div>
      </AbsoluteFill>
      <Narration t={t1} />
    </NavyBg>
  );
};

// ---------- Scene 7: summary ----------
const t7 = SCENES[7];
const L7 = t7.lines;
const STEPS = ["เลือกหลักสูตร", "ตรวจสอบ", "แก้ไขและบันทึก", "ยืนยันครบ 3 ฉบับ"];

export const Scene7: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 14], [0, 1], clamp);
  const per = Math.max(12, Math.floor((L7["7a"].end - L7["7a"].start) / 5));
  const closing = rise(f, L7["7b"].start - 6, 20);
  return (
    <NavyBg>
      <AbsoluteFill style={{ opacity: fadeIn, alignItems: "center", paddingTop: 130 }}>
        <div style={{ fontSize: 52, fontWeight: 700, opacity: rise(f, 4) }}>สรุปขั้นตอน</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 50 }}>
          {STEPS.map((s, i) => {
            const p = rise(f, L7["7a"].start + per * (i + 1) - 10);
            return (
              <React.Fragment key={s}>
                {i > 0 && <div style={{ fontSize: 60, margin: "0 16px", opacity: p, color: C.amber }}>→</div>}
                <div style={{
                  opacity: p, transform: `translateY(${(1 - p) * 24}px)`, width: 330, background: C.warmWhite, color: C.navy,
                  borderRadius: 22, padding: "26px 20px", textAlign: "center", boxShadow: "0 18px 44px rgba(0,0,0,0.3)",
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%", background: i === 3 ? C.success : C.amber, color: i === 3 ? "#fff" : C.navy,
                    fontSize: 32, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
                  }}>{i + 1}</div>
                  <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.3 }}>{s}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginTop: 70, textAlign: "center", opacity: closing, transform: `translateY(${(1 - closing) * 20}px)` }}>
          <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.5, maxWidth: 1400 }}>
            ขอความร่วมมือทุกหลักสูตรตรวจสอบให้ครบถ้วน
            <br />
            เพื่อเตรียมแบบประเมินให้พร้อมก่อนนำไปใช้
          </div>
          <div style={{ fontSize: 30, marginTop: 22, opacity: 0.85 }}>ดูคู่มือเพิ่มเติมได้ที่ปุ่ม “คู่มือการใช้งานระบบ” บนหน้าเว็บ</div>
        </div>
      </AbsoluteFill>
      <Narration t={t7} captionTop={[]} />
    </NavyBg>
  );
};
