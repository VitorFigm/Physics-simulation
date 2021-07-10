import { Controller } from "@app/types";
import { Observable } from "@app/utils";
import { KeyboardService } from "app/services/keyboard/keyboard.service";
import { State, StateHandler } from "../states";

export const controlPlayer: Controller = ({ Inject }, player) => {
  const keyboard = Inject(KeyboardService);
  const stateHandler = Inject(StateHandler);
  const { walk } = stateHandler.get();

  const accelaration = 0.1;

  const walking = walk(1.5, accelaration, 0.05);

  const walkLeft = () => walking.transform({ accelaration });
  const walkRight = () => walking.transform({ accelaration: -accelaration });

  const keyDownMapper = {
    d: walkLeft,
    a: walkRight,
  };

  defineKeyboardControl(keyDownMapper, keyboard.listenKeyDown.bind(keyboard));

  const halt = () => walking.transform({ accelaration: 0 });

  const keyUpMapper = {
    d: halt,
    a: halt,
  };

  defineKeyboardControl(keyUpMapper, keyboard.listenKeyUp.bind(keyboard));

  function defineKeyboardControl(
    keyMapper: Record<string, () => State>,
    keyboardListener: (key: string) => Observable<string>
  ) {
    Object.entries(keyMapper).forEach(([key, createNewState]) => {
      keyboardListener(key).subscribe({
        next() {
          stateHandler.set(player, createNewState());
        },
      });
    });
  }
};
