import { Position, View } from "@app/models";
import { Observable } from "@app/utils";
import { RenderizationAPI } from "app/core/engines/graphics/graphical-api";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { CollisionService } from "app/services/collision/collision.service";

export const controlBallBucket = (ballBucked: View) => {
  let collision$: Observable<View>;
  const imageApi = inject(RenderizationAPI);

  onInit();
  setCollision();

  function onInit() {
    collision$ = inject(CollisionService).observeCollision(ballBucked);
  }

  function setCollision() {
    collision$.subscribe({
      next: (view) => {
        view.actionEmitter?.emit("catchBall", {
          ball: createBall(),
        });
      },
    });
  }

  function createBall() {
    return {
      box: {
        height: 20,
        width: 20,
      },
      sprite: imageApi.imageLoader.get("ball").image,
      position: ballBucked.position,
    };
  }
};
