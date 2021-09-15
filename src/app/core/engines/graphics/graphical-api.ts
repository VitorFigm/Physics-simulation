import { Sprite } from "@app/models";
import { assets, ValidImageName } from "assets";
import { graphics } from "dom-canvas";

interface ImageLoaderMap extends Map<ValidImageName, Sprite> {
  get(key: ValidImageName): Sprite;
}

export class RenderizationAPI {
  graphics = graphics;

  imageLoader = this._getImageLoader() as ImageLoaderMap;

  private _getImageLoader() {
    const imageEntries = assets.map(({ name, load }) => {
      const image = new Image();
      image.src = load;

      return [name, { image }] as [ValidImageName, Sprite];
    });

    return new Map(imageEntries);
  }
}
