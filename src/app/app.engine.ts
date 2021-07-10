import { Context } from "@app/types";
import { controlPlayer } from "./controllers/player/player.controller";
import { GraphicalAPI } from "./core/engines/graphics/graphical-api";
import { Graphics } from "./core/engines/graphics/graphics.engine";
import { Inject } from "./core/inversion-of-control/inversion-of-control.engine";
import { INITIAL_VIEW } from "./initial-view";

const context = { Inject } as Context;

const view = INITIAL_VIEW;

controlPlayer(context, view.player);

const game = () => {
  contructNextView();
  Graphics.drawCanvas(view, GraphicalAPI);
  requestAnimationFrame(game);
};

function contructNextView() {
  Object.values(view).forEach((viewComponent) =>
    viewComponent.state.construct(viewComponent)
  );
}

addEventListener("load", () => requestAnimationFrame(game));
