import { Provider } from "@app/models";
import { controlPlayer } from "./controllers/player/player.controller";
import { StateHandler } from "./controllers/states/state-handler";
import { GraphicalAPI } from "./core/engines/graphics/graphical-api";
import { Graphics } from "./core/engines/graphics/graphics.engine";
import { provide } from "./core/inversion-of-control/inversion-of-control.engine";
import { createInitialView } from "./initial-view";
import { KeyboardService } from "./services/keyboard/keyboard.service";

import { stateProviders } from "./controllers/states/state.providers";

/// providers
{
  const coreProviders: Provider[] = [KeyboardService];

  provide(coreProviders);
  provide(stateProviders);
}

const view = createInitialView();
/// constrols
{
  controlPlayer(view.player);
}

const game = () => {
  contructNextView();
  Graphics.drawCanvas(view, GraphicalAPI);
  requestAnimationFrame(game);
};

function contructNextView() {
  Object.values(view).forEach((viewComponent) => {
    viewComponent.state.construct(viewComponent);
  });
}

addEventListener("load", () => requestAnimationFrame(game));
