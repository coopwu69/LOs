import React from "react";
import { cancelRender, Composition, continueRender, delayRender, Series, staticFile } from "remotion";
import { FPS, H, W } from "./theme";
import { SCENES } from "./timeline";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5, Scene6 } from "./scenes/Scene56";
import { Scene1, Scene7 } from "./scenes/TitleScenes";

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

const ALL: [number, React.FC][] = [[1, Scene1], [2, Scene2], [3, Scene3], [4, Scene4], [5, Scene5], [6, Scene6], [7, Scene7]];
const FULL_FRAMES = ALL.reduce((n, [s]) => n + SCENES[s].duration, 0);

const Tutorial: React.FC = () => (
  <Series>
    {ALL.map(([s, C]) => (
      <Series.Sequence key={s} durationInFrames={SCENES[s].duration}>
        <C />
      </Series.Sequence>
    ))}
  </Series>
);

const Single: React.FC<{ scene: number }> = ({ scene }) => {
  const C = ALL.find(([s]) => s === scene)![1];
  return <C />;
};

// Preview (~29s): scene 2 + the start of scene 3 (review page, first form row).
const PREVIEW_FRAMES = SCENES[2].duration + SCENES[3].lines["3b"].end + 12;

// Voice sample (~16s): scene 2 up to the program click.
const VOICE_SAMPLE_FRAMES = SCENES[2].lines["2d"].end + 15;

export const Root: React.FC = () => (
  <>
    <Composition id="Tutorial" component={Tutorial} durationInFrames={FULL_FRAMES} fps={FPS} width={W} height={H} />
    {ALL.map(([s]) => (
      <Composition key={s} id={`Scene${s}`} component={Single} defaultProps={{ scene: s }} durationInFrames={SCENES[s].duration} fps={FPS} width={W} height={H} />
    ))}
    <Composition id="VoiceSample" component={Scenes23} durationInFrames={VOICE_SAMPLE_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Preview" component={Scenes23} durationInFrames={PREVIEW_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Scenes23" component={Scenes23} durationInFrames={SCENES[2].duration + SCENES[3].duration} fps={FPS} width={W} height={H} />
  </>
);
