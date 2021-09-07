import { View } from "./models/types/index";
import { GraphicalAPI, Provider } from "@app/models";
import { controlPlayer } from "./controllers/player/player.controller";
import { RenderizationAPI } from "./core/engines/graphics/graphical-api";
import { Graphics } from "./core/engines/graphics/scene-draw/graphics.engine";
import {
  inject,
  provide,
} from "./core/inversion-of-control/inversion-of-control.engine";
import { createInitialView } from "./initial-view";
import { KeyboardService } from "./services/keyboard/keyboard.service";

import { stateProviders } from "./controllers/states/state.providers";
import { controlEnemy } from "./controllers/enemy/enemy.controller";
import { NextFrameService } from "./services/next-frame/next-frame.service";
import { CollisionService } from "./services/colision/colision.service";
import { KeyboardControl } from "./controllers/player/keyboard-control/keyboard-control";
import { FightService } from "./services/fight/fight.service";
import { DEFAULT_CONSISTENT_FRAME_RATE } from "./services/next-frame/constants";

/// providers
{
  const coreProviders: Provider[] = [
    KeyboardControl,
    FightService,
    KeyboardService,
    NextFrameService,
    CollisionService,
    Graphics,
    { provide: GraphicalAPI, useClass: RenderizationAPI },
    RenderizationAPI,
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

nextFrameService.checkFramePass(DEFAULT_CONSISTENT_FRAME_RATE).subscribe({
  next: () => {
    constructNextView();
  },
});

let counter = 0;

nextFrameService.checkFramePass().subscribe({
  next: () => {
    counter++;
    graphicalEngine.drawCanvas(view);
  },
});

function constructNextView() {
  Object.values(view).forEach((viewComponent) => {
    viewComponent.state.construct(viewComponent);
  });
}
