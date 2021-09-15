export const assets = [
  {
    name: "box",
    load: require("./box.svg"),
  },
  {
    name: "blue-box",
    load: require("./blue-box.svg"),
  },
] as const;

export type ValidImageName = typeof assets[number]["name"];
