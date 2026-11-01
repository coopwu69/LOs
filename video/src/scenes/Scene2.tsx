import React from "react";
import { SCENES } from "../timeline";
import { union } from "../components/camera";
import { shotBox } from "../components/Overlays";
import { SceneConfig, SceneShell } from "../components/SceneShell";

const t = SCENES[2];
const L = t.lines;
const center = (b: { x: number; y: number; w: number; h: number }, dx = 0.5, dy = 0.5) => ({ x: b.x + b.w * dx, y: b.y + b.h * dy });

const search = shotBox("s2_school", "search");
const row = shotBox("s2_search_3", "logRow");
const searchAt = L["2c"].start + 26; // cursor lands on the search box
const rowAt = L["2d"].start + 22; // cursor lands on the program row
const clickRow = L["2d"].end - 4;

export const scene2: SceneConfig = {
  t,
  step: { n: 1, label: "เลือกหลักสูตร" },
  shots: [
    { at: 0, shot: "s2_school" },
    { at: searchAt + 6, shot: "s2_search_1", fade: 1 },
    { at: searchAt + 12, shot: "s2_search_2", fade: 1 },
    { at: searchAt + 18, shot: "s2_search_3", fade: 4 },
    { at: rowAt, shot: "s2_hover", fade: 4 },
    { at: clickRow + 8, shot: "s3_review", fade: 12 },
  ],
  cam: [
    { at: 0, focus: null },
    { at: L["2b"].start, focus: union(shotBox("s2_school", "title"), shotBox("s2_school", "count")), maxZoom: 2, pad: 70 },
    { at: L["2c"].start, focus: union(search, shotBox("s2_school", "hint")), maxZoom: 1.8, pad: 80 },
    { at: L["2d"].start - 16, focus: union(search, row), maxZoom: 1.5, pad: 80 },
    { at: clickRow + 6, focus: null, dur: 18 },
  ],
  highlights: [
    { from: L["2a"].start + 8, to: L["2a"].end + 6, box: shotBox("s2_school", "table"), pad: 6 },
    { from: L["2b"].start + 14, to: L["2b"].end + 8, box: union(shotBox("s2_school", "title"), shotBox("s2_school", "count")) },
    { from: searchAt, to: L["2c"].end + 12, box: search, pad: 6 },
    { from: rowAt, to: clickRow + 4, box: row, pad: 4 },
  ],
  cursor: [
    { at: L["2c"].start, x: 900, y: 620 },
    { at: L["2c"].start + 4, ...center(search, 0.3), dur: 22, click: true },
    { at: L["2d"].start, ...center(row, 0.3), dur: 22 },
    { at: clickRow - 1, ...center(row, 0.3), dur: 1, click: true },
  ],
  cursorHideAfter: clickRow + 14,
};

export const Scene2: React.FC = () => <SceneShell cfg={scene2} />;
