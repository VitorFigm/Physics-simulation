import { GraphicalAPI, ImageLoader, Sprite } from "@app/models";
import { assets, ValidImageName } from "assets";
import { graphics } from "dom-canvas";

export class RenderizationAPI {
  graphics = graphics;

  imageLoader: ReadonlyMap<ValidImageName, Sprite> = this._getImageLoader();

  private _getImageLoader() {
    const imageEntries = assets.map(({ name, load, frameCount }) => {
      const image = new Image();
      image.src = load;

      return [name, { frameCount, image }] as [ValidImageName, Sprite];
    });

    return new Map(imageEntries);
  }
}
