import { Controller } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { CollisionService } from "app/services/collision/collision.service";

export const controlEnemy: Controller = (enemy) => {
  const collision$ = inject(CollisionService).observeCollision(enemy);
};
