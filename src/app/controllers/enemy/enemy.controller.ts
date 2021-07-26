import { Controller } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { ColisionService } from "app/services/colision/colision.service";
import { Stading } from "../states/standing.state";
import { StateHandler } from "../states/state-handler";

export const controlEnemy: Controller = (enemy) => {
  const stateHanlder = inject(StateHandler);

  const colision$ = inject(ColisionService).observeCollision(enemy);
};
