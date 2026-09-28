import React from "react";
import { Series } from "remotion";
import { ErrorFlow, Intro, Outro, VoiceTrack, WhatIs } from "./Cards";
import { center, FULL, pad, planCard, r, Rect, union } from "./engine";
import narration from "./narration.json";
import { planOf, ScreenScene, ScreenSceneProps } from "./ScreenScene";

// ---------------------------------------------------------------------------
// The script. Frame numbers are local to each scene (30 fps) and refer to the
// SILENT timeline; voice-over holds are inserted at caption boundaries (see
// planScene in engine.ts). Rule: no transition (camera move, shot crossfade,
// highlight fade-out ≈12f, click ripple ≈22f) may straddle a caption time.
// Rects come from src/shots.json (captured by scripts/capture.mjs from the
// live site, school `mgt` → program `log`).
// ---------------------------------------------------------------------------

const table = r("review", "table");
const actionsZoom = pad(r("review", "actions1"), 40);
const dlg = (k: string) => r("dialog", k);

// 1 — the school link each faculty receives
const sceneSchool: ScreenSceneProps = {
  voice: "programs",
  duration: 200,
  chip: "ขั้นที่ 1",
  shots: [{ at: 0, value: "programs" }],
  camera: [
    { at: 0, value: FULL },
    { at: 20, value: pad(r("programs", "table"), 20) },
  ],
  cursor: [
    { at: 70, value: { x: 1300, y: 780 } },
    { at: 80, value: center(r("programs", "submittedBadge")) },
    { at: 110, value: center(r("programs", "formChips")) },
    { at: 140, value: { x: 520, y: center(r("programs", "programRow")).y } },
  ],
  clicks: [170],
  highlights: [
    { rect: r("programs", "submittedBadge"), from: 78, to: 104 },
    { rect: r("programs", "formChips"), from: 108, to: 140 },
    { rect: r("programs", "programRow"), from: 140, to: 195, spot: true },
  ],
  captions: [
    { at: 0, title: "เปิดลิงก์ของสำนักวิชาที่ได้รับ", body: "จะพบรายชื่อหลักสูตรทั้งหมดของสำนักวิชา" },
    { at: 70, title: "“ส่งแล้ว” สีเขียว = พร้อมให้ตรวจ", body: "ช่องขวาบอกว่าฟอร์มไหนยืนยันแล้ว (มีเครื่องหมาย ✓)" },
    { at: 140, title: "กดที่แถวของหลักสูตรที่ท่านรับผิดชอบ" },
  ],
};

// 2 — the review page and its buttons
const sceneReview: ScreenSceneProps = {
  voice: "review",
  duration: 200,
  chip: "ขั้นที่ 2",
  shots: [{ at: 0, value: "review" }],
  camera: [
    { at: 0, value: FULL },
    { at: 10, value: pad(table, 20) },
    { at: 90, value: actionsZoom },
  ],
  highlights: [
    { rect: r("review", "row1"), from: 20, to: 90, label: 1 },
    { rect: r("review", "row2"), from: 28, to: 90, label: 2 },
    { rect: r("review", "row3"), from: 36, to: 90, label: 3 },
    { rect: r("review", "view1"), from: 100, to: 195, label: 1 },
    { rect: r("review", "copy1"), from: 108, to: 195, label: 2 },
    { rect: r("review", "download1"), from: 116, to: 195, label: 3 },
    { rect: r("review", "confirm1"), from: 124, to: 195, label: 4 },
  ],
  captions: [
    { at: 0, title: "ตาราง 3 แถว = แบบฟอร์ม 3 ฉบับ", body: "สถานประกอบการ · อาจารย์นิเทศ · นักศึกษา" },
    { at: 90, title: "ปุ่มของแต่ละฟอร์ม", body: "① ดู · ② คัดลอกลิงก์ · ③ ดาวน์โหลด (Word) · ④ ยืนยันว่าตรวจสอบแล้ว" },
  ],
};

// 3 — open the form and read it
const stepRect = r("form-step", "step");
const sceneView: ScreenSceneProps = {
  voice: "view",
  duration: 290,
  chip: "ขั้นที่ 3",
  shots: [
    { at: 0, value: "review" },
    { at: 30, value: "form" },
    { at: 140, value: "form-step" },
    { at: 190, value: "form-lo" },
  ],
  camera: [
    { at: 0, value: actionsZoom },
    { at: 30, value: FULL },
    { at: 60, value: pad(r("form", "stepper"), 40) },
    { at: 190, value: { x: 240, y: 150, w: 1120, h: 660 }, dur: 1 },
  ],
  cursor: [
    { at: 0, value: { x: 1300, y: 600 } },
    { at: 6, value: center(r("review", "view1")) },
    { at: 30, value: { x: 800, y: 400 }, dur: 1 },
    { at: 80, value: center(stepRect) },
    { at: 190, value: { x: 1500, y: 420 }, dur: 1 },
  ],
  clicks: [20, 130],
  highlights: [
    { rect: r("review", "view1"), from: 4, to: 28, label: 1 },
    { rect: r("form", "stepper"), from: 65, to: 110 },
    { rect: stepRect, from: 100, to: 176 },
    { rect: r("form-lo", "radiogroup"), from: 200, to: 280 },
  ],
  captions: [
    { at: 0, title: "กด “ดู” เพื่อเปิดแบบฟอร์ม" },
    { at: 60, title: "กดแถบวงกลมเพื่อข้ามไปแต่ละส่วน", body: "ไม่ต้องกรอกข้อมูล — ข้อมูลที่ลองพิมพ์ไม่ถูกนำไปใช้" },
    { at: 190, title: "ตรวจคำถาม ถ้อยคำ และตัวเลือกคะแนนให้ครบทุกข้อ" },
  ],
};

// 4 — confirm
const sceneConfirm: ScreenSceneProps = {
  voice: "confirm",
  duration: 320,
  chip: "ขั้นที่ 4",
  shots: [
    { at: 0, value: "review" },
    { at: 45, value: "dialog" },
    { at: 105, value: "dialog-filled" },
    { at: 230, value: "review-done1" },
  ],
  camera: [
    { at: 0, value: actionsZoom },
    { at: 45, value: pad(union(dlg("name"), dlg("submit")), 40) },
    { at: 230, value: pad(union(r("review-done1", "status1"), r("review-done1", "confirm1")), 50) },
  ],
  cursor: [
    { at: 0, value: { x: 1250, y: 700 } },
    { at: 8, value: center(r("review", "confirm1")) },
    { at: 50, value: { x: dlg("name").x + 250, y: center(dlg("name")).y } },
    { at: 72, value: { x: dlg("email").x + 250, y: center(dlg("email")).y } },
    { at: 92, value: { x: dlg("phone").x + 250, y: center(dlg("phone")).y } },
    { at: 118, value: { x: dlg("check").x + 28, y: dlg("check").y + 30 } },
    { at: 170, value: center(dlg("submit")) },
    { at: 230, value: { x: 1300, y: 640 }, dur: 1 },
  ],
  clicks: [20, 60, 82, 102, 140, 200],
  highlights: [
    { rect: r("review", "confirm1"), from: 6, to: 30, label: 4 },
    { rect: dlg("name"), from: 55, to: 155, label: 1 },
    { rect: dlg("email"), from: 77, to: 155, label: 2 },
    { rect: dlg("phone"), from: 97, to: 155, label: 3 },
    { rect: dlg("check"), from: 128, to: 155 },
    { rect: dlg("submit"), from: 170, to: 215, spot: true },
    { rect: r("review-done1", "status1"), from: 240, to: 315 },
  ],
  captions: [
    { at: 0, title: "ถูกต้องแล้ว → กด “ยืนยันว่าตรวจสอบแล้ว”" },
    { at: 45, title: "กรอกชื่อ · อีเมล · เบอร์โทร แล้วติ๊กช่องยืนยัน" },
    { at: 170, title: "กด “ยืนยันการตรวจสอบ”" },
    { at: 230, title: "สถานะเปลี่ยนเป็น “ตรวจแล้ว” สีเขียว", body: "พร้อมชื่อผู้ตรวจและเวลา" },
  ],
};

// 5 — all three forms
const sceneAll: ScreenSceneProps = {
  voice: "all",
  duration: 100,
  chip: "ขั้นที่ 5",
  shots: [
    { at: 0, value: "review-done1" },
    { at: 15, value: "review-doneall" },
  ],
  camera: [{ at: 0, value: pad(table, 20) }],
  highlights: [
    { rect: r("review-doneall", "status1"), from: 25, to: 95, label: 1 },
    { rect: r("review-doneall", "status2"), from: 32, to: 95, label: 2 },
    { rect: r("review-doneall", "status3"), from: 39, to: 95, label: 3 },
  ],
  captions: [{ at: 0, title: "ทำซ้ำให้ครบทั้ง 3 ฟอร์ม ✓", body: "ยืนยันแยกทีละฟอร์ม" }],
};

// ---------------------------------------------------------------------------

type Item = { d: number; el: (d: number) => React.ReactNode };

const S = (p: ScreenSceneProps): Item => ({ d: planOf(p).total, el: () => <ScreenScene {...p} /> });

const lineCount = (scene: string) => ((narration as unknown as Record<string, string[]>)[scene] ?? []).length;

/** Card scene: at least `min` frames, longer if its narration needs it. */
const Card = (scene: string, min: number, render: (d: number) => React.ReactNode): Item => {
  const plan = planCard(scene, lineCount(scene), min, 10, 8);
  return {
    d: plan.total,
    el: (d) => (
      <>
        {render(d)}
        <VoiceTrack scene={scene} at={plan.at} />
      </>
    ),
  };
};

const BODY: Item[] = [
  Card("whatis", 200, (d) => <WhatIs duration={d} />),
  S(sceneSchool),
  S(sceneReview),
  S(sceneView),
  S(sceneConfirm),
  S(sceneAll),
  Card("errorflow", 170, (d) => <ErrorFlow duration={d} />),
  Card("outro", 120, (d) => <Outro duration={d} />),
];

const introPlan = planCard("intro", lineCount("intro"), 100, 10, 8);
const bodyFrames = BODY.reduce((a, s) => a + s.d, 0);
const minutes = Math.max(1, Math.round((introPlan.total + bodyFrames) / 30 / 60));

export const SCENES: Item[] = [Card("intro", 100, (d) => <Intro duration={d} minutes={minutes} />), ...BODY];

export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0);

export const Tutorial: React.FC = () => (
  <Series>
    {SCENES.map((s, i) => (
      <Series.Sequence key={i} durationInFrames={s.d}>
        {s.el(s.d)}
      </Series.Sequence>
    ))}
  </Series>
);
