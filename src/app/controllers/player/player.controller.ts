import { Controller, State } from "@app/models";
import { Observable } from "@app/utils";
import { KeyboardService } from "app/services/keyboard/keyboard.service";
import { StateHandler } from "../states/state-handler";

export const controlPlayer: Controller = ({ Inject }, player) => {
  const keyboard = Inject(KeyboardService);
  const stateHandler = Inject(StateHandler);
  const states = stateHandler.getStates();

  const accelaration = 0.1;
  const maxVelocity = 1;

  const walking = new states.Moving(accelaration, "x", maxVelocity);

  const keyDownMapper = {
    d: () => walking.setAcceleration(accelaration),
    a: () => walking.setAcceleration(-accelaration),
    w: () => new states.Jumping(stateHandler, 20),
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
          stateHandler.setState(player, getNewState());
        },
      });
    });
  }
};
