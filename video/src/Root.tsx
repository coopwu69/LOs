import React from "react";
import { Composition } from "remotion";
import { FPS, H, W } from "./theme";
import { TOTAL, Tutorial } from "./Tutorial";

export const RemotionRoot: React.FC = () => (
  <Composition id="Tutorial" component={Tutorial} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
