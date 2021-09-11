// import { Controller } from "@app/models";
// import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
// import { CollisionService } from "app/services/colision/colision.service";
// import { FightService } from "app/services/fight/fight.service";
// import { Stading } from "../states/standing.state";
// import { StateHandler } from "../states/state-handler";

// export const controlEnemy: Controller = (enemy) => {
//   const stateHandler = inject(StateHandler);

//   const collision$ = inject(CollisionService).observeCollision(enemy);

//   const fightService = inject(FightService);
//   fightService.registerFighter(enemy);
// };
