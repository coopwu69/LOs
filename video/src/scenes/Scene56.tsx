import React from "react";
import shots from "../shots.json";
import { SCENES } from "../timeline";
import { Box, union } from "../components/camera";
import { shotBox as sb } from "../components/Overlays";
import { SceneConfig, SceneShell } from "../components/SceneShell";
import { Callout, DemoBadge, Dim, DocPreview, DownloadChip, MeetingLoop } from "../components/Graphics";

const center = (b: Box, dx = 0.5, dy = 0.5) => ({ x: b.x + b.w * dx, y: b.y + b.h * dy });

// ---------- Scene 5: Word download ----------
const t5 = SCENES[5];
const L5 = t5.lines;
const download0 = sb("s5_review", "download0");
const clickDownload = L5["5b"].start + 26;

export const scene5: SceneConfig = {
  t: t5,
  step: { n: 4, label: "ดาวน์โหลด Word" },
  shots: [{ at: 0, shot: "s5_review" }],
  cam: [
    { at: 0, focus: null },
    { at: 8, focus: union(sb("s5_review", "row0"), download0), maxZoom: 1.5, pad: 40 },
    { at: clickDownload + 30, focus: null, dur: 18 },
  ],
  highlights: [{ from: L5["5a"].start + 10, to: clickDownload + 2, box: download0, pad: 6 }],
  cursor: [
    { at: L5["5a"].start + 4, x: 1100, y: 720 },
    { at: L5["5a"].start + 8, ...center(download0), dur: 24 },
    { at: clickDownload - 1, ...center(download0), dur: 1, click: true },
  ],
  cursorHideAfter: clickDownload + 20,
  extra: () => (
    <>
      <DownloadChip from={clickDownload + 6} to={L5["5b"].end + 20} filename={(shots as Record<string, { filename?: string }>).docx.filename ?? "Company_LOG.docx"} />
      <Dim from={clickDownload + 34} to={L5["5c"].start + 2} opacity={0.82} />
      <DocPreview from={clickDownload + 38} to={L5["5c"].start} pages={[shots.docx.file, shots.docx_lo.file]} />
      <Dim from={L5["5c"].start - 4} to={t5.duration} opacity={0.82} />
      <MeetingLoop from={L5["5c"].start} to={t5.duration} />
    </>
  ),
};
export const Scene5: React.FC = () => <SceneShell cfg={scene5} />;

// ---------- Scene 6: confirm ----------
const t6 = SCENES[6];
const L6 = t6.lines;
const confirm0 = sb("s5_review", "confirm0");
const clickConfirm = L6["6a"].end - 2;
const dlg = sb("s6_dialog", "dialog");
const fieldSpan = L6["6b"].end - L6["6b"].start;
const f1 = L6["6b"].start + Math.round(fieldSpan * 0.18);
const f2 = L6["6b"].start + Math.round(fieldSpan * 0.55);
const f3 = L6["6b"].start + Math.round(fieldSpan * 0.85);
const f4 = L6["6c"].start + 10;
const clickSubmit = L6["6c"].end - 2;
const doneAt = clickSubmit + 14;

export const scene6: SceneConfig = {
  t: t6,
  step: { n: 5, label: "ยืนยันการตรวจสอบ" },
  shots: [
    { at: 0, shot: "s5_review" },
    { at: clickConfirm + 6, shot: "s6_dialog", fade: 8 },
    { at: f1, shot: "s6_f1", fade: 6 },
    { at: f2, shot: "s6_f2", fade: 6 },
    { at: f3, shot: "s6_f3", fade: 6 },
    { at: f4, shot: "s6_f4", fade: 6 },
    { at: doneAt, shot: "s6_done", fade: 12 },
  ],
  cam: [
    { at: 0, focus: null },
    { at: 8, focus: union(sb("s5_review", "row0"), confirm0), maxZoom: 1.5, pad: 40 },
    { at: clickConfirm + 6, focus: dlg, pad: 24 },
    { at: doneAt, focus: union(sb("s6_done", "status0"), sb("s6_done", "reviewedBy"), sb("s6_done", "confirm0")), maxZoom: 1.9, pad: 60 },
    { at: L6["6e"].start - 6, focus: null, dur: 20 },
  ],
  highlights: [
    { from: 14, to: clickConfirm + 2, box: confirm0, pad: 6 },
    { from: clickConfirm + 14, to: f1 + 2, box: sb("s6_dialog", "info"), pad: 6 },
    { from: f1, to: f2, box: sb("s6_dialog", "name"), pad: 6 },
    { from: f2, to: f3, box: sb("s6_dialog", "email"), pad: 6 },
    { from: f3, to: f4, box: sb("s6_dialog", "phone"), pad: 6 },
    { from: f4, to: clickSubmit - 20, box: sb("s6_dialog", "checkRow"), pad: 6 },
    { from: clickSubmit - 22, to: clickSubmit + 2, box: sb("s6_dialog", "submit"), pad: 6 },
    { from: doneAt + 8, to: L6["6e"].start - 8, box: union(sb("s6_done", "status0"), sb("s6_done", "reviewedBy")), pad: 10 },
    { from: doneAt + 20, to: L6["6e"].start - 8, box: sb("s6_done", "confirm0"), pad: 6 },
    { from: L6["6e"].start + 10, to: t6.duration - 4, box: sb("s6_done", "status1"), pad: 6 },
    { from: L6["6e"].start + 18, to: t6.duration - 4, box: sb("s6_done", "status2"), pad: 6 },
  ],
  cursor: [
    { at: 8, x: 1000, y: 700 },
    { at: 12, ...center(confirm0), dur: 24 },
    { at: clickConfirm - 1, ...center(confirm0), dur: 1, click: true },
    { at: clickConfirm + 10, ...center(sb("s6_dialog", "name"), 0.8, 0.6), dur: 22 },
    { at: L6["6c"].start - 10, ...center(sb("s6_dialog", "checkRow"), 0.06, 0.3), dur: 18 },
    { at: f4 - 3, ...center(sb("s6_dialog", "checkRow"), 0.06, 0.3), dur: 1, click: true },
    { at: clickSubmit - 20, ...center(sb("s6_dialog", "submit")), dur: 16 },
    { at: clickSubmit - 1, ...center(sb("s6_dialog", "submit")), dur: 1, click: true },
  ],
  cursorHideAfter: doneAt + 8,
  extra: (_f, cam) => (
    <>
      <DemoBadge from={f1} to={doneAt} box={dlg} cam={cam} />
      <Callout from={doneAt + 14} to={L6["6e"].start - 8} box={sb("s6_done", "confirm0")} cam={cam} tone="navy" text="ยืนยันแล้ว ปุ่มจะเปลี่ยนเป็น “ตรวจซ้ำ”" />
      <Callout from={L6["6e"].start + 24} to={t6.duration - 4} box={union(sb("s6_done", "status1"), sb("s6_done", "status2"))} cam={cam} tone="amber" place="below" text="ยืนยันให้ครบทั้ง 3 ฉบับ" />
    </>
  ),
};
export const Scene6: React.FC = () => <SceneShell cfg={scene6} />;
