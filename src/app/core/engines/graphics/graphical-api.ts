import { GraphicalImplementation, ImageLoader } from "@app/models";
import { assets } from "assets";
import { graphics } from "dom-canvas";

const getImageLoader = () => {
  const imageEntries = assets.map(({ name, load }) => {
    const image = new Image();
    image.src = load;

    return [name, image] as [string, HTMLImageElement];
  });

  return new Map(imageEntries) as ImageLoader;
};

export abstract class GraphicalAPI extends GraphicalImplementation {
  static graphics = graphics;

  static imageLoader = getImageLoader();
}
