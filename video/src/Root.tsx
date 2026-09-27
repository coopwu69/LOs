import React from "react";
import { cancelRender, Composition, continueRender, delayRender, Series, staticFile } from "remotion";
import { FPS, H, W } from "./theme";
import { SCENES } from "./timeline";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";

const fontHandle = delayRender("fonts");
Promise.all(
  [400, 500, 600, 700].flatMap((w) => [
    new FontFace("Plex Thai", `url(${staticFile(`fonts/plex-thai-${w}.woff2`)})`, { weight: String(w) }),
    new FontFace("Plex Latin", `url(${staticFile(`fonts/plex-latin-${w}.woff2`)})`, { weight: String(w) }),
  ]).map((f) => f.load().then((ff) => document.fonts.add(ff))),
)
  .then(() => continueRender(fontHandle))
  .catch((e) => cancelRender(e));

const Scenes23: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={SCENES[2].duration}>
      <Scene2 />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENES[3].duration}>
      <Scene3 />
    </Series.Sequence>
  </Series>
);

// Preview (~29s): scene 2 + the start of scene 3 (review page, first form row).
const PREVIEW_FRAMES = SCENES[2].duration + SCENES[3].lines["3b"].end + 12;

// Voice sample (~16s): scene 2 up to the program click.
const VOICE_SAMPLE_FRAMES = SCENES[2].lines["2d"].end + 15;

export const Root: React.FC = () => (
  <>
    <Composition id="VoiceSample" component={Scenes23} durationInFrames={VOICE_SAMPLE_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Preview" component={Scenes23} durationInFrames={PREVIEW_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Scenes23" component={Scenes23} durationInFrames={SCENES[2].duration + SCENES[3].duration} fps={FPS} width={W} height={H} />
  </>
);
