import durations from "./audio-durations.json";
import narration from "../narration/narration.json";
import spec from "./timeline-spec.json";
import { FPS } from "./theme";

export type Line = { id: string; text: string; start: number; end: number };
export type SceneTimeline = { scene: number; duration: number; lines: Record<string, Line>; order: Line[] };

type Spec = { scene: number; lead: number; tail: number; gap: number; lines: { id: string; pre?: number }[] };

const textById = Object.fromEntries((narration as { id: string; text: string }[]).map((l) => [l.id, l.text]));

// Mirrored in scripts/make-srt.mjs — keep the two in sync.
export function buildScene(s: Spec): SceneTimeline {
  let cursor = s.lead;
  const order: Line[] = [];
  for (const l of s.lines) {
    const start = cursor + (l.pre ?? 0);
    const len = Math.ceil(((durations as Record<string, number>)[l.id] ?? 2) * FPS);
    order.push({ id: l.id, text: textById[l.id], start, end: start + len });
    cursor = start + len + s.gap;
  }
  return {
    scene: s.scene,
    duration: cursor - s.gap + s.tail,
    lines: Object.fromEntries(order.map((l) => [l.id, l])),
    order,
  };
}

export const SCENES: Record<number, SceneTimeline> = Object.fromEntries(
  (spec as Spec[]).map((s) => [s.scene, buildScene(s)]),
);
