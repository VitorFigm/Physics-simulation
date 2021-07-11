import { Controller } from "@app/types";
import { Observable } from "@app/utils";
import { KeyboardService } from "app/services/keyboard/keyboard.service";
import { State, StateHandler } from "../states/state-handler";

export const controlPlayer: Controller = ({ Inject }, player) => {
  const keyboard = Inject(KeyboardService);
  const stateHandler = Inject(StateHandler);
  const { move, jump } = stateHandler.getStates();

  const accelaration = 0.1;

  const walking = move({
    accelaration,
    axis: "x",
    friction: 0.05,
    maxVelocity: 1,
  });

  const walkLeft = () => walking.transform({ accelaration });
  const walkRight = () => walking.transform({ accelaration: -accelaration });

  const keyDownMapper = {
    d: walkLeft,
    a: walkRight,
    w: () => jump(20),
  };

  defineKeyboardControl(keyDownMapper, keyboard.listenKeyDown.bind(keyboard));

  const halt = () => walking.transform({ accelaration: 0 });

  const keyUpMapper = {
    d: halt,
    a: halt,
  };

  defineKeyboardControl(keyUpMapper, keyboard.listenKeyUp.bind(keyboard));

  function defineKeyboardControl(
    keyMapper: Record<string, () => State<unknown>>,
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
