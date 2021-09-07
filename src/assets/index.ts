export const assets = [
  {
    name: "box",
    load: require("./box.svg"),
    frameCount: 8,
  },
  {
    name: "char_idle",
    load: require("./char/spr_StrikerIdle_strip.png"),
    frameCount: 8,
  },
  {
    name: "char_run",
    load: require("./char/spr_StrikerRun_strip.png"),
    frameCount: 8,
  },
  {
    name: "char_jump",
    load: require("./char/spr_StrikerJump_strip.png"),
    frameCount: 12,
  },
  {
    name: "char_attack",
    load: require("./char/spr_StrikerSlash_stripWithEffect.png"),
    frameCount: 16,
  },
] as const;

export type ValidImageName = typeof assets[number]["name"];
