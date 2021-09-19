export const assets = [
  {
    name: "box",
    load: require("./box.png"),
  },
  {
    name: "blue-box",
    load: require("./blue-box.png"),
  },
  {
    name: "red-box",
    load: require("./red-box.png"),
  },
] as const;

export type ValidImageName = typeof assets[number]["name"];
