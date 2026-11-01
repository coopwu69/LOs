import React from "react";
import { SCENES } from "../timeline";
import { Box, union } from "../components/camera";
import { shotBox as sb } from "../components/Overlays";
import { SceneConfig, SceneShell } from "../components/SceneShell";
import { Callout, CompareCards, DemoBadge, Dim, SharedDiagram } from "../components/Graphics";

const t = SCENES[4];
const L = t.lines;
const center = (b: Box, dx = 0.5, dy = 0.5) => ({ x: b.x + b.w * dx, y: b.y + b.h * dy });

const editBtn = sb("s4_company", "editBtn");
const clickEdit = L["4a"].end - 2;
// 4b: open the section, open question 1, show the misspelling.
const openSection = L["4b"].start + 4;
const openQuestion = openSection + 34;
const showTypo = openQuestion + 12;
const fixAt = L["4b"].end + 26;
const clickSave = L["4c"].end - 2;
const fillAt = L["4d"].start + Math.round((L["4d"].end - L["4d"].start) * 0.45);
const clickConfirm = L["4d"].end + 4;
const savedAt = clickConfirm + 10;

const textarea = sb("s4_typo", "textarea");
const dialog = sb("s4_dialog", "dialog");

export const scene4: SceneConfig = {
  t,
  step: { n: 3, label: "แก้ไขและบันทึก" },
  shots: [
    { at: 0, shot: "s4_company" },
    { at: clickEdit + 8, shot: "s4_edit", fade: 12 },
    { at: openSection + 22, shot: "s4_section", fade: 8 },
    { at: showTypo, shot: "s4_typo", fade: 8 },
    { at: fixAt, shot: "s4_fixed", fade: 10 },
    { at: clickSave + 6, shot: "s4_dialog", fade: 8 },
    { at: fillAt, shot: "s4_dialog_filled", fade: 12 },
    { at: savedAt, shot: "s4_saved", fade: 8 },
    { at: L["4f"].start - 8, shot: "s4_verify", fade: 12 },
  ],
  cam: [
    { at: 0, focus: null },
    { at: 6, focus: sb("s4_company", "toolbar"), maxZoom: 1.8, pad: 80 },
    { at: clickEdit + 6, focus: null, dur: 16 },
    { at: openSection - 4, focus: union(sb("s4_edit", "statusBar"), sb("s4_edit", "section1Summary")), pad: 40 },
    { at: openQuestion - 8, focus: sb("s4_section", "q1Summary"), maxZoom: 1.6, pad: 80 },
    { at: showTypo, focus: union(textarea, sb("s4_typo", "label")), maxZoom: 1.8, pad: 80 },
    { at: L["4c"].start - 6, focus: union(sb("s4_fixed", "statusBar"), textarea), pad: 40 },
    { at: clickSave + 6, focus: dialog, pad: 30 },
    { at: savedAt, focus: sb("s4_saved", "statusBar"), maxZoom: 1.7, pad: 60 },
    { at: L["4e"].start - 10, focus: null, dur: 16 },
    { at: L["4f"].start - 8, focus: sb("s4_verify", "q1"), maxZoom: 1.8, pad: 60 },
    { at: L["4g"].start - 10, focus: null, dur: 16 },
  ],
  highlights: [
    { from: 14, to: clickEdit + 4, box: editBtn, pad: 6 },
    { from: openSection - 2, to: openSection + 24, box: sb("s4_edit", "statusText"), pad: 8 },
    { from: showTypo + 6, to: fixAt - 2, box: textarea, pad: 6 },
    { from: fixAt + 4, to: L["4c"].start + 30, box: textarea, pad: 6 },
    { from: L["4c"].start + 6, to: clickSave, box: sb("s4_fixed", "saveBtn"), pad: 6 },
    { from: clickSave + 12, to: fillAt + 30, box: union(sb("s4_dialog", "name"), sb("s4_dialog", "phone")), pad: 10 },
    { from: fillAt + 30, to: clickConfirm, box: union(sb("s4_dialog", "checkRow"), sb("s4_dialog", "submit")), pad: 8 },
    { from: savedAt + 6, to: L["4e"].start - 12, box: sb("s4_saved", "statusText"), pad: 8 },
    { from: L["4f"].start + 6, to: L["4f"].end + 6, box: sb("s4_verify", "fixedWord"), pad: 6 },
  ],
  cursor: [
    { at: 8, x: 900, y: 640 },
    { at: 12, ...center(editBtn), dur: 22 },
    { at: clickEdit - 1, ...center(editBtn), dur: 1, click: true },
    { at: openSection - 18, ...center(sb("s4_edit", "section1Open")), dur: 18 },
    { at: openSection, ...center(sb("s4_edit", "section1Open")), dur: 1, click: true },
    { at: openQuestion - 16, ...center(sb("s4_section", "q1Edit")), dur: 14 },
    { at: openQuestion, ...center(sb("s4_section", "q1Edit")), dur: 1, click: true },
    { at: L["4b"].end, ...center(textarea, 0.7, 0.75), dur: 16 },
    { at: L["4c"].start + 8, ...center(sb("s4_fixed", "saveBtn")), dur: 20 },
    { at: clickSave - 1, ...center(sb("s4_fixed", "saveBtn")), dur: 1, click: true },
    { at: clickConfirm - 22, ...center(sb("s4_dialog", "submit")), dur: 18 },
    { at: clickConfirm - 1, ...center(sb("s4_dialog", "submit")), dur: 1, click: true },
  ],
  cursorHideAfter: savedAt + 12,
  extra: (_f, cam) => (
    <>
      <Callout from={showTypo + 10} to={fixAt - 2} box={textarea} cam={cam} tone="red" text="ตัวอย่างคำผิด: “แก้ปัณหา”" />
      <Callout from={fixAt + 4} to={L["4c"].start + 30} box={textarea} cam={cam} tone="green" text="แก้เป็น: “แก้ปัญหา”" />
      <DemoBadge from={fillAt} to={clickConfirm + 4} box={dialog} cam={cam} />
      <Dim from={L["4e"].start - 12} to={L["4e"].end + 10} opacity={0.82} />
      <SharedDiagram from={L["4e"].start - 6} to={L["4e"].end + 8} />
      <Dim from={L["4g"].start - 12} to={t.duration} opacity={0.82} />
      <CompareCards from={L["4g"].start - 6} to={t.duration} />
    </>
  ),
};

export const Scene4: React.FC = () => <SceneShell cfg={scene4} />;
