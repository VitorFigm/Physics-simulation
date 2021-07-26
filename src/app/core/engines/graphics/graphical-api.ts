import { GraphicalAPI, ImageLoader } from "@app/models";
import { assets } from "assets";
import { graphics } from "dom-canvas";

export class RenderizationAPI extends GraphicalAPI {
  graphics = graphics;

  imageLoader = this._getImageLoader();

  private _getImageLoader() {
    const imageEntries = assets.map(({ name, load }) => {
      const image = new Image();
      image.src = load;

      return [name, image] as [string, HTMLImageElement];
    });

    return new Map(imageEntries) as ImageLoader;
  }
}
