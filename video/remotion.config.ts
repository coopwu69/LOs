import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);

// Remotion's bundled headless shell lands under node_modules/.remotion, which
// exceeds Windows MAX_PATH in deep folders. Set REMOTION_CHROME to a Chrome
// Headless Shell elsewhere (e.g. Playwright's) to use that instead.
if (process.env.REMOTION_CHROME) {
  Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
