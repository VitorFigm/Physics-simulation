export const assets = [
  {
    name: "char",
    load: require("./char/char.svg"),
  },
] as const;

export type ValidImageName = typeof assets[number]["name"];
