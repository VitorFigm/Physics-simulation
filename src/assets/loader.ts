const assets = [
  {
    name: "char",
    load: require("./char/char.svg"),
  },
] as const;

type ValidImageName = typeof assets[number]["name"];

export const ImageLoader = () => {
  const imageEntries = assets.map(({ name, load }) => {
    const image = new Image();
    image.src = load;

    return [name, image] as [string, HTMLImageElement];
  });

  return new Map(imageEntries) as ReadonlyMap<ValidImageName, HTMLImageElement>;
};
