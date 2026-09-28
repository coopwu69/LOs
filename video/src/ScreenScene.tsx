import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BAR_H,
  cameraAt,
  fadeInOut,
  hasVoice,
  Key,
  LEAD,
  lerpPt,
  planScene,
  Pt,
  Rect,
  rectToScreen,
  toScreen,
  toScript,
  track,
  VIEW_H,
  VIEW_W,
} from "./engine";
import { C, FONT } from "./theme";

export type Highlight = {
  rect: Rect;
  from: number;
  to: number;
  label?: string | number;
  /** dim everything else */
  spot?: boolean;
};

export type Caption = { at: number; title: string; body?: string };

export type ScreenSceneProps = {
  /** narration key: caption i is voiced by public/voice/<voice>-<i>.mp3 */
  voice: string;
  /** script length in frames, before voice-over holds are inserted */
  duration: number;
  chip: string;
  shots: Key<string>[];
  camera: Key<Rect>[];
  cursor?: Key<Pt>[];
  clicks?: number[];
  highlights?: Highlight[];
  captions: Caption[];
};

// Address-bar text per screenshot (real URLs on the live site).
const SCHOOL_URL = "los-wu.vercel.app/schools/mgt?lang=th";
const REVIEW_URL = "los-wu.vercel.app/programs/log/review?lang=th";
const FORM_URL = "los-wu.vercel.app/mgt/log/company/th";
const SHOT_URL: Record<string, string> = {
  programs: SCHOOL_URL,
  review: REVIEW_URL,
  "review-copied": REVIEW_URL,
  dialog: REVIEW_URL,
  "dialog-filled": REVIEW_URL,
  "review-done1": REVIEW_URL,
  "review-doneall": REVIEW_URL,
  form: FORM_URL,
  "form-step": FORM_URL,
  "form-lo": FORM_URL,
};

const XFADE = 10;

function BrowserCard({ frame, shots }: { frame: number; shots: Key<string>[] }) {
  let i = 0;
  for (let k = 0; k < shots.length; k++) if (shots[k].at <= frame) i = k;
  const cur = shots[i];
  const prev = i > 0 ? shots[i - 1] : null;
  const t = prev ? Math.min(1, (frame - cur.at) / XFADE) : 1;
  const layers = prev && t < 1 ? [{ s: prev.value, o: 1 }, { s: cur.value, o: t }] : [{ s: cur.value, o: 1 }];

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: -BAR_H,
        width: VIEW_W,
        height: VIEW_H + BAR_H,
        borderRadius: 14,
        overflow: "hidden",
        background: C.cream,
        boxShadow: "0 30px 80px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.08)",
      }}
    >
      <div
        style={{
          height: BAR_H,
          background: "#ebe9e4",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 18,
            flex: 1,
            maxWidth: 760,
            height: 28,
            borderRadius: 14,
            background: C.cream,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 8,
            fontFamily: FONT,
            fontSize: 15,
            color: C.text2,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.text2} strokeWidth="2.5">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          {SHOT_URL[cur.value] ?? "/"}
        </div>
      </div>
      <div style={{ position: "relative", width: VIEW_W, height: VIEW_H }}>
        {layers.map((l) => (
          <Img
            key={l.s}
            src={staticFile(`shots/${l.s}.png`)}
            style={{ position: "absolute", inset: 0, width: VIEW_W, height: VIEW_H, opacity: l.o }}
          />
        ))}
      </div>
    </div>
  );
}

function Cursor({ p, pressed }: { p: Pt; pressed: number }) {
  const s = 1 - 0.18 * pressed;
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      style={{
        position: "absolute",
        left: p.x - 7,
        top: p.y - 4,
        transform: `scale(${s})`,
        transformOrigin: "7px 4px",
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,.35))",
      }}
    >
      <path d="M4 2 L4 19 L8.6 14.8 L11.6 21.4 L14.4 20.2 L11.5 13.7 L17.8 13.4 Z" fill="#fff" stroke={C.navy} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function Ripple({ p, age }: { p: Pt; age: number }) {
  if (age < 0 || age > 22) return null;
  const t = age / 22;
  const size = 20 + 70 * t;
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - size / 2,
        top: p.y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `4px solid ${C.accent}`,
        opacity: 1 - t,
      }}
    />
  );
}

function HighlightBox({ h, frame, real, cam }: { h: Highlight; frame: number; real: number; cam: ReturnType<typeof cameraAt> }) {
  const { fps } = useVideoConfig();
  if (frame < h.from - 1 || frame > h.to + 12) return null;
  const inS = spring({ frame: frame - h.from, fps, config: { damping: 14, stiffness: 160 } });
  const out = interpolate(frame, [h.to, h.to + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = Math.min(inS, out);
  const sr = rectToScreen(cam, h.rect);
  const p = 10;
  const scale = interpolate(inS, [0, 1], [1.12, 1]);
  // pulse runs on real time so it keeps breathing while a segment is held
  const pulseT = (((real - h.from) % 45) + 45) % 45 / 45;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: sr.x - p,
          top: sr.y - p,
          width: sr.w + p * 2,
          height: sr.h + p * 2,
          borderRadius: 14,
          border: `5px solid ${C.accent}`,
          boxShadow: h.spot
            ? `0 0 0 9999px rgba(7,28,49,${0.5 * o}), 0 0 28px rgba(245,165,36,.55)`
            : "0 0 28px rgba(245,165,36,.55)",
          opacity: o,
          transform: `scale(${scale})`,
        }}
      >
        {h.label != null && (
          <div
            style={{
              position: "absolute",
              left: -24,
              top: -24,
              minWidth: 46,
              height: 46,
              padding: "0 10px",
              borderRadius: 23,
              background: C.accent,
              color: C.navy,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,.3)",
            }}
          >
            {h.label}
          </div>
        )}
      </div>
      {frame >= h.from && frame <= h.to && (
        <div
          style={{
            position: "absolute",
            left: sr.x - p - 14 * pulseT,
            top: sr.y - p - 14 * pulseT,
            width: sr.w + (p + 14 * pulseT) * 2,
            height: sr.h + (p + 14 * pulseT) * 2,
            borderRadius: 18,
            border: `3px solid ${C.accent}`,
            opacity: (1 - pulseT) * 0.6 * o,
          }}
        />
      )}
    </>
  );
}

export function CaptionCard({ captions, frame, chip }: { captions: Caption[]; frame: number; chip: string }) {
  let i = 0;
  for (let k = 0; k < captions.length; k++) if (captions[k].at <= frame) i = k;
  const c = captions[i];
  const age = frame - c.at;
  const o = interpolate(age, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(age, [0, 10], [14, 0], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        right: 110,
        bottom: 34,
        minHeight: 176,
        borderRadius: 24,
        background: "rgba(7,28,49,.96)",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow: "0 20px 50px rgba(0,0,0,.4)",
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "26px 44px",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: "10px 22px",
          borderRadius: 999,
          background: C.accent,
          color: C.navy,
          fontWeight: 700,
          fontSize: 28,
        }}
      >
        {chip}
      </div>
      <div style={{ opacity: o, transform: `translateY(${y}px)` }}>
        <div style={{ color: C.cream, fontWeight: 700, fontSize: 44, lineHeight: 1.35 }}>{c.title}</div>
        {c.body && (
          <div style={{ color: "rgba(255,254,251,.82)", fontSize: 30, lineHeight: 1.5, marginTop: 6 }}>{c.body}</div>
        )}
      </div>
    </div>
  );
}

export const planOf = (p: ScreenSceneProps) => planScene(p.captions.map((c) => c.at), p.duration, p.voice);

export const ScreenScene: React.FC<ScreenSceneProps> = (props) => {
  const real = useCurrentFrame();
  const { segs, total } = planOf(props);
  const frame = toScript(segs, real);
  const cam = cameraAt(props.camera, frame);

  const clicks = props.clicks ?? [];
  const pressed = clicks.reduce((m, f) => {
    const a = frame - f;
    return Math.max(m, a >= -3 && a <= 6 ? interpolate(a, [-3, 0, 6], [0, 1, 0]) : 0);
  }, 0);
  const cursorWorld = props.cursor ? track(props.cursor, frame, lerpPt) : null;
  const cursorScreen = cursorWorld ? toScreen(cam, cursorWorld) : null;
  const cursorOpacity = props.cursor ? interpolate(frame, [props.cursor[0].at, props.cursor[0].at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 30% 20%, ${C.navy700} 0%, ${C.navy} 65%)`,
        opacity: fadeInOut(real, total, 10),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})`,
        }}
      >
        <BrowserCard frame={frame} shots={props.shots} />
      </div>
      {(props.highlights ?? []).map((h, k) => (
        <HighlightBox key={k} h={h} frame={frame} real={real} cam={cam} />
      ))}
      {cursorScreen &&
        clicks.map((f) => {
          const at = props.cursor ? toScreen(cam, track(props.cursor, f, lerpPt)) : cursorScreen;
          return <Ripple key={f} p={at} age={frame - f} />;
        })}
      {cursorScreen && (
        <div style={{ opacity: cursorOpacity }}>
          <Cursor p={cursorScreen} pressed={pressed} />
        </div>
      )}
      <CaptionCard captions={props.captions} frame={frame} chip={props.chip} />
      {segs.map((s, i) => {
        const id = `${props.voice}-${i}`;
        return hasVoice(id) ? (
          <Sequence key={id} from={s.n0 + LEAD} layout="none">
            <Audio src={staticFile(`voice/${id}.mp3`)} />
          </Sequence>
        ) : null;
      })}
    </AbsoluteFill>
  );
};
