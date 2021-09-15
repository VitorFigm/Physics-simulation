import { View } from "./models/types/index";
import { GraphicalAPI, GraphicalContext, Provider } from "@app/models";
import { controlPlayer } from "./controllers/player/player.controller";
import { RenderizationAPI } from "./core/engines/graphics/graphical-api";
import { Graphics } from "./core/engines/graphics/scene-draw/graphics.engine";
import {
  inject,
  provide,
} from "./core/inversion-of-control/inversion-of-control.engine";
import { createInitialView } from "./initial-view";
import { KeyboardService } from "./services/keyboard/keyboard.service";

import { stateProviders } from "./controllers/states/state-providers";
import { NextFrameService } from "./services/next-frame/next-frame.service";
import { CollisionService } from "./services/colision/colision.service";
import { FightService } from "./services/fight/fight.service";
import { PROCESS_FRAME_RATE } from "./services/next-frame/constants";
import { MouseService } from "./services/mouse/mouse.service";
import { setAbosolutePositon } from "./utils/position";

/// providers
{
  const coreProviders: Provider[] = [
    FightService,
    KeyboardService,
    MouseService,
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
}

const nextFrameService = inject(NextFrameService);
const graphicalEngine = inject(Graphics);

// constructViewTree(view);

nextFrameService.checkFramePass(PROCESS_FRAME_RATE).subscribe({
  next: () => {
    constructViewTree(view);
  },
});

let counter = 0;

nextFrameService.checkFramePass().subscribe({
  next: () => {
    counter++;
    graphicalEngine.drawCanvas(view);
  },
});

function constructViewTree(context: GraphicalContext, relativeTo?: View) {
  Object.values(context).forEach((viewComponent: View) => {
    setAbosolutePositon(viewComponent, relativeTo?.position.absolute);
    viewComponent.stateMachine?.executeRoutine(viewComponent);

    if (viewComponent.components) {
      constructViewTree(viewComponent.components, viewComponent);
    }
  });
}
