import { GraphicalAPI, Provider } from "@app/models";
import { controlPlayer } from "./controllers/player/player.controller";
import { RenderizationAPI } from "./core/engines/graphics/graphical-api";
import { Graphics } from "./core/engines/graphics/graphics.engine";
import {
  inject,
  provide,
} from "./core/inversion-of-control/inversion-of-control.engine";
import { createInitialView } from "./initial-view";
import { KeyboardService } from "./services/keyboard/keyboard.service";

import { stateProviders } from "./controllers/states/state.providers";
import { controlEnemy } from "./controllers/enemy/enemy.controller";
import { NextFrameService } from "./services/next-frame/next-frame.service";
import { ColisionService } from "./services/colision/colision.service";
import { KeyboardControl } from "./controllers/player/keyboard-control/keyboard-control";

/// providers
{
  const coreProviders: Provider[] = [
    KeyboardService,
    NextFrameService,
    ColisionService,
    Graphics,
    { provide: GraphicalAPI, useClass: RenderizationAPI },
  ];

  provide(coreProviders);
  provide(stateProviders);
}

const view = createInitialView();
/// controls
{
  controlPlayer(view.player);
  controlEnemy(view.enemy);
}

const nextFrameService = inject(NextFrameService);
const graphicalEngine = inject(Graphics);

nextFrameService.checkFramePass().subscribe({
  next: () => {
    contructNextView();
    graphicalEngine.drawCanvas(view);
  },
});

function contructNextView() {
  Object.values(view).forEach((viewComponent) => {
    viewComponent.state.construct(viewComponent);
  });
}
