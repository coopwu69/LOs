import { loadFont } from "@remotion/google-fonts/IBMPlexSansThaiLooped";

// Same typeface as the web app (IBM Plex Sans Thai Looped).
const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
});

export const FONT = fontFamily;

// Palette mirrors web/src/app/globals.css: one brand navy + warm cream surfaces.
export const C = {
  navy: "#071c31",
  navy700: "#123a5c",
  navy500: "#2c5d8a",
  navy100: "#dbe7f2",
  cream: "#fffefb",
  sunken: "#f6f5f2",
  border: "#e7e5e0",
  text2: "#4a5563",
  accent: "#f5a524", // highlight ring / pointer accent
  accentSoft: "rgba(245,165,36,0.18)",
  success: "#0f7a4f",
  successBg: "#e8f6ee",
  warning: "#b45309",
  warningBg: "#fff6e0",
  danger: "#c62828",
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;
