import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { SceneTimeline } from "../timeline";
import { C, FONT } from "../theme";
import { camAt, CamKey } from "./camera";
import { Captions, Cursor, CursorKey, HL, Highlights, ShotKey, ShotTrack } from "./Overlays";

export type SceneConfig = {
  t: SceneTimeline;
  step: { n: number; label: string };
  shots: ShotKey[];
  cam: CamKey[];
  highlights: HL[];
  cursor: CursorKey[];
  cursorHideAfter?: number;
  captionTop?: string[];
  extra?: (frame: number) => React.ReactNode;
};

const StepBadge: React.FC<{ n: number; label: string }> = ({ n, label }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, 100, 115], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", right: 40, top: 28, opacity: o, display: "flex", alignItems: "center", gap: 14,
      padding: "10px 24px 10px 12px", borderRadius: 999, background: C.navy, color: C.warmWhite,
      fontFamily: FONT, fontSize: 30, fontWeight: 600, boxShadow: "0 8px 24px rgba(7,28,49,0.25)",
    }}>
      <span style={{ background: C.amber, color: C.navy, borderRadius: 999, padding: "2px 16px", fontSize: 26, fontWeight: 700 }}>
        ขั้นที่ {n}/5
      </span>
      {label}
    </div>
  );
};

export const SceneShell: React.FC<{ cfg: SceneConfig }> = ({ cfg }) => {
  const frame = useCurrentFrame();
  const cam = camAt(cfg.cam, frame);
  const top = new Set(cfg.captionTop ?? []);
  return (
    <AbsoluteFill style={{ backgroundColor: C.page }}>
      <ShotTrack keys={cfg.shots} cam={cam} />
      <Highlights items={cfg.highlights} cam={cam} />
      {cfg.extra?.(frame)}
      <Cursor keys={cfg.cursor} cam={cam} hideAfter={cfg.cursorHideAfter} />
      <StepBadge n={cfg.step.n} label={cfg.step.label} />
      <Captions lines={cfg.t.order.map((l) => ({ ...l, top: top.has(l.id) }))} />
      {cfg.t.order.map((l) => (
        <Sequence key={l.id} from={l.start} durationInFrames={l.end - l.start + 2} layout="none">
          <Audio src={staticFile(`audio/${l.id}.wav`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
