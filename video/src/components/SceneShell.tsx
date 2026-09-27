import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { SceneTimeline } from "../timeline";
import { C, FONT } from "../theme";
import { Cam, camAt, CamKey } from "./camera";
import { Captions, Cursor, CursorKey, HL, Highlights, ShotKey, ShotTrack } from "./Overlays";

export type SceneConfig = {
  t: SceneTimeline;
  step?: { n: number; label: string };
  shots: ShotKey[];
  cam: CamKey[];
  highlights: HL[];
  cursor: CursorKey[];
  cursorHideAfter?: number;
  captionTop?: string[];
  /** Overlays drawn above the screenshot/highlights and below the cursor. */
  extra?: (frame: number, cam: Cam) => React.ReactNode;
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

/** Voice + matching captions for every narration line of a scene. */
export const Narration: React.FC<{ t: SceneTimeline; captionTop?: string[] }> = ({ t, captionTop = [] }) => {
  const top = new Set(captionTop);
  return (
    <>
      <Captions lines={t.order.map((l) => ({ ...l, top: top.has(l.id) }))} />
      {t.order.map((l) => (
        <Sequence key={l.id} from={l.start} durationInFrames={l.end - l.start + 2} layout="none">
          <Audio src={staticFile(`audio/${l.id}.wav`)} />
        </Sequence>
      ))}
    </>
  );
};

export const SceneShell: React.FC<{ cfg: SceneConfig }> = ({ cfg }) => {
  const frame = useCurrentFrame();
  const cam = camAt(cfg.cam, frame);
  return (
    <AbsoluteFill style={{ backgroundColor: C.page }}>
      <ShotTrack keys={cfg.shots} cam={cam} />
      <Highlights items={cfg.highlights} cam={cam} />
      {cfg.extra?.(frame, cam)}
      <Cursor keys={cfg.cursor} cam={cam} hideAfter={cfg.cursorHideAfter} />
      {cfg.step && <StepBadge n={cfg.step.n} label={cfg.step.label} />}
      <Narration t={cfg.t} captionTop={cfg.captionTop} />
    </AbsoluteFill>
  );
};
