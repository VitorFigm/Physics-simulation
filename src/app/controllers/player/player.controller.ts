import { Controller, State } from "@app/models";
import { Observable } from "@app/utils";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { KeyboardService } from "app/services/keyboard/keyboard.service";
import { Jumping } from "../states/jump/jumping.state";
import { Moving, MovingProps } from "../states/move/moving.state";
import { StateHandler } from "../states/state-handler";

export const controlPlayer: Controller = (player) => {
  const keyboard = inject(KeyboardService);
  const { setState } = inject(StateHandler);

  const initialAcceleration = 0.1;

  const walking = inject(Moving, {
    axis: "x",
    maxVelocity: 1,
    initialAcceleration,
  });

  const jumping = inject(Jumping, { maxDistance: 20 });

  const keyDownMapper = {
    d: () => walking.setAcceleration(initialAcceleration),
    a: () => walking.setAcceleration(-initialAcceleration),
    w: () => jumping,
  };

  defineKeyboardControl(keyDownMapper, keyboard.listenKeyDown.bind(keyboard));

  const halt = () => walking.stop();

  const keyUpMapper = {
    d: halt,
    a: halt,
  };

  defineKeyboardControl(keyUpMapper, keyboard.listenKeyUp.bind(keyboard));

  function defineKeyboardControl(
    keyMapper: Record<string, () => State>,
    keyboardListener: (key: string) => Observable<string>
  ) {
    Object.entries(keyMapper).forEach(([key, getNewState]) => {
      keyboardListener(key).subscribe({
        next() {
          setState(player, getNewState());
        },
      });
    });
  }
};
