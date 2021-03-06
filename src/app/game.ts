import { View } from "./types/index";
import { GraphicalContext, Position, Provider } from "app/types";
import { controlPlayer } from "./modules/player/player.controller";
import { RenderizationAPI } from "./core/engines/graphics/graphical-api";
import { Graphics } from "./core/engines/graphics/scene-draw/graphics.engine";
import {
  inject,
  provide,
} from "./core/inversion-of-control/inversion-of-control.engine";
import { createInitialView } from "./initial-view";
import { KeyboardService } from "./services/keyboard/keyboard.service";

import { stateProviders } from "./modules/global/states/state-providers";
import { NextFrameService } from "./services/next-frame/next-frame.service";
import { CollisionService } from "./services/collision/collision.service";
import { FightService } from "./services/fight/fight.service";
import { MouseService } from "./services/mouse/mouse.service";
import { setAbosolutePositon } from "./utils/position";
import { controlEnemy } from "./modules/enemy/enemy.controller";
import { ParticleService } from "./services/particles/particles.service";
import { controlBallBucket } from "./modules/ball-bucket/ball-bucket.controller";
import { FiniteStateMachine } from "./modules/global/states/state-machine";
import { GraphicalAPI, GraphicalContextToken } from "./core/providers";

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
    ParticleService,
  ];

  provide(coreProviders);
  provide(stateProviders);
}

const view = createInitialView();
provide([{ provide: GraphicalContextToken, useValue: view }]);

constructViewTree(view);
/// controls
{
  controlPlayer(view.player);
  controlEnemy(view.enemy);
  controlBallBucket(view.ballBucket);
}

const nextFrameService = inject(NextFrameService);
const graphicalEngine = inject(Graphics);

nextFrameService.checkFramePass().subscribe({
  next: () => {
    constructViewTree(view);
  },
});

nextFrameService.checkFramePass().subscribe({
  next: () => {
    graphicalEngine.drawCanvas(view);
  },
});

function constructViewTree(context: GraphicalContext, relativeTo?: View) {
  Object.values(context).forEach((viewComponent: View) => {
    setAbosolutePositon(viewComponent, relativeTo?.position.absolute);

    if (viewComponent.actionEmitter instanceof FiniteStateMachine) {
      viewComponent.actionEmitter?.executeRoutine(viewComponent);
    }

    if (viewComponent.components) {
      constructViewTree(viewComponent.components, viewComponent);
    }
  });
}
