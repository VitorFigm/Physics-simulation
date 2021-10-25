import { Controller } from "app/types";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { CollisionService } from "app/services/collision/collision.service";

export const controlEnemy: Controller = (enemy) => {
  const collision$ = inject(CollisionService).observeCollision(enemy);
};
