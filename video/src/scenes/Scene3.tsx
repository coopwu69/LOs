import React from "react";
import { SCENES } from "../timeline";
import { Box, union } from "../components/camera";
import { shotBox as sb } from "../components/Overlays";
import { SceneConfig, SceneShell } from "../components/SceneShell";
import { Checklist } from "../components/Checklist";

const t = SCENES[3];
const L = t.lines;
const center = (b: Box, dx = 0.5, dy = 0.5) => ({ x: b.x + b.w * dx, y: b.y + b.h * dy });

// Screen region left of the checklist panel (and above the captions).
const LEFT: Box = { x: 40, y: 140, w: 1260, h: 760 };

const view0 = sb("s3_review", "view0");
const actions0 = union(view0, sb("s3_review", "download0"), sb("s3_review", "confirm0"));
const stepper = union(...[1, 2, 3, 4, 5, 6].map((n) => sb("s3_company", `step${n}`)));
const step3 = sb("s3_company", "step3");

const clickView = L["3e"].end - 4;
const clickStep = L["3f"].end + 4;
const checklistIn = L["3h"].start;
const checklistOut = L["3m"].start - 6;

export const scene3: SceneConfig = {
  t,
  step: { n: 2, label: "ตรวจสอบแบบฟอร์มทั้ง 3 ฉบับ" },
  shots: [
    { at: 0, shot: "s3_review" },
    { at: clickView + 8, shot: "s3_company", fade: 12 },
    { at: clickStep + 8, shot: "s3_step3", fade: 12 },
    { at: L["3i"].start, shot: "s3_company", fade: 10 },
    { at: L["3j"].start, shot: "s3_step3", fade: 10 },
    { at: L["3m"].start - 10, shot: "s3_review", fade: 12 },
  ],
  cam: [
    { at: 0, focus: null },
    { at: L["3a"].start, focus: sb("s3_review", "table"), maxZoom: 1.25, pad: 30 },
    { at: L["3e"].start, focus: actions0, maxZoom: 2, pad: 90 },
    { at: clickView + 6, focus: null, dur: 18 },
    { at: L["3f"].start, focus: stepper, maxZoom: 1.5, pad: 60 },
    { at: clickStep + 6, focus: null, dur: 18 },
    { at: L["3g"].start, focus: union(sb("s3_step3", "q1"), sb("s3_step3", "q1Grid")), maxZoom: 1.6, pad: 40 },
    { at: checklistIn, focus: union(sb("s3_step3", "q1"), sb("s3_step3", "q1Grid")), into: LEFT, pad: 20 },
    { at: L["3i"].start, focus: union(sb("s3_company", "title"), sb("s3_company", "formName")), into: LEFT, maxZoom: 1.8, pad: 40 },
    { at: L["3j"].start, focus: union(sb("s3_step3", "sectionTitle"), sb("s3_step3", "q2")), into: LEFT, pad: 30 },
    { at: L["3k"].start, focus: sb("s3_step3", "q1"), into: LEFT, maxZoom: 1.9, pad: 40 },
    { at: L["3l"].start, focus: sb("s3_step3", "q1Grid"), into: LEFT, pad: 20 },
    { at: L["3m"].start - 10, focus: null, dur: 18 },
  ],
  highlights: [
    { from: L["3a"].start + 8, to: L["3a"].end + 4, box: sb("s3_review", "table"), pad: 4 },
    ...[0, 1, 2].map((i) => ({
      from: L[`3${"bcd"[i]}`].start - 2,
      to: L[`3${"bcd"[i]}`].end + 6,
      box: union(sb("s3_review", `name${i}`), sb("s3_review", `status${i}`)),
    })),
    { from: L["3e"].start + 12, to: clickView + 4, box: view0, pad: 6 },
    { from: L["3f"].start + 6, to: L["3f"].end - 10, box: stepper, pad: 8 },
    { from: L["3g"].start + 4, to: L["3g"].end + 12, box: union(sb("s3_step3", "q1"), sb("s3_step3", "q1Grid")), pad: 8 },
    { from: L["3i"].start + 10, to: L["3i"].end + 6, box: union(sb("s3_company", "title"), sb("s3_company", "formName")) },
    { from: L["3j"].start + 10, to: L["3j"].end + 6, box: union(sb("s3_step3", "q1"), sb("s3_step3", "q2")) },
    { from: L["3k"].start + 10, to: L["3k"].end + 6, box: sb("s3_step3", "q1"), pad: 8 },
    { from: L["3l"].start + 10, to: L["3l"].end + 10, box: sb("s3_step3", "q1Grid"), pad: 6 },
    ...[0, 1, 2].map((i) => ({
      from: L["3m"].start + i * 10,
      to: L["3m"].end + 24,
      box: sb("s3_review", `row${i}`),
      pad: -2,
    })),
  ],
  cursor: [
    { at: L["3e"].start, x: 1500, y: 760 },
    { at: L["3e"].start + 4, ...center(view0), dur: 24 },
    { at: clickView - 1, ...center(view0), dur: 1, click: true },
    { at: L["3f"].end - 26, ...center(step3, 0.5, 0.3), dur: 22 },
    { at: clickStep - 1, ...center(step3, 0.5, 0.3), dur: 1, click: true },
  ],
  cursorHideAfter: clickStep + 16,
  extra: () => (
    <Checklist
      from={checklistIn}
      to={checklistOut}
      items={[
        { text: "ชื่อหลักสูตรและข้อมูลทั่วไปถูกต้อง", at: L["3i"].start },
        { text: "ผลลัพธ์การเรียนรู้ (LOs) ครบถ้วน ไม่ขาดหรือซ้ำ", at: L["3j"].start },
        { text: "ถ้อยคำและการสะกดถูกต้อง เข้าใจง่าย", at: L["3k"].start },
        { text: "ตัวเลือกคะแนนและคำอธิบายแต่ละระดับตรงตามเกณฑ์", at: L["3l"].start },
      ]}
    />
  ),
};

export const Scene3: React.FC = () => <SceneShell cfg={scene3} />;
