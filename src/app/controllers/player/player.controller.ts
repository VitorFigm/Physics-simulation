import { Controller } from "@app/models";
import {
  inject,
  provide,
} from "app/core/inversion-of-control/inversion-of-control.engine";
import { ColisionService } from "app/services/colision/colision.service";
import { Jumping } from "../states/jump/jumping.state";
import { Moving } from "../states/move/moving.state";
import { KeyboardControl } from "./keyboard-control/keyboard-control";

provide([KeyboardControl]);

export const controlPlayer: Controller = (player) => {
  const initialAcceleration = 0.1;
  const walking = inject(Moving, {
    axis: "x",
    maxVelocity: 1,
    initialAcceleration,
  });
  const jumping = inject(Jumping, { maxDistance: 300 });
  const colision$ = inject(ColisionService).observeCollision(player);
  const keyboardControl = inject(KeyboardControl, { view: player });
  const halt = () => walking.stop();

  mapKeyboard();
  observeColision();

  function mapKeyboard() {
    const keyDownMapper = {
      d: () => walking.setAcceleration(initialAcceleration),
      a: () => walking.setAcceleration(-initialAcceleration),
      w: () => jumping,
    };

    const keyUpMapper = {
      d: halt,
      a: halt,
    };

    keyboardControl.mapKeyDownEvent(keyDownMapper);
    keyboardControl.mapKeyUpEvent(keyUpMapper);
  }

  function observeColision() {
    colision$.subscribe({
      next: () => {
        if (player.state.isMoving() || player.state.isJumping()) {
          player.state.bounce();
        }
      },
    });
  }
};
