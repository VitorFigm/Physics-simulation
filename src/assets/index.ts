export const assets = [
  {
    name: "box",
    load: require("./box.png"),
  },
  {
    name: "blue-box",
    load: require("./blue-box.png"),
  },
] as const;

export type ValidImageName = typeof assets[number]["name"];
