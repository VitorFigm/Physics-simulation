import "./style.scss";

import { engine } from "./app/app.engine";

const game = () => {
  engine();
  requestAnimationFrame(game);
};

addEventListener("load", () => requestAnimationFrame(game));
