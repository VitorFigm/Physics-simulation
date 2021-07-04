import "./style.scss";
import { graphics } from "./canvas";
import { ImageLoader } from "./assets/loader";

import { engine } from "./app/app.engine";

const externalContext = {
  graphics,
  imageLoader: ImageLoader(),
};

export type ExternalContext = typeof externalContext;

const game = () => {
  engine();
  requestAnimationFrame(game);
};

addEventListener("load", () => requestAnimationFrame(game));
