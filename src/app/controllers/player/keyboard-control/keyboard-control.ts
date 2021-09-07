import { State, View } from "@app/models";
import { Observable } from "@app/utils";
import { StateHandler } from "app/controllers/states/state-handler";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { KeyboardService } from "app/services/keyboard/keyboard.service";

type KeyboardControlProps = {
  view: View;
};

type KeyMap = Record<string, () => State>;

/**
 * This services sets state of a view based on which key are pressed
 * It needs to be instantiated with a key mapper, a object that, for each key strings
 * containing a keyboard key, has a function that return a state to be setted
 * */

export class KeyboardControl {
  private _setState: (view: View, newState: State) => void;

  private _keyboardService = inject(KeyboardService);

  constructor(private _props: KeyboardControlProps) {
    const stateHandler = inject(StateHandler);
    this._setState = stateHandler.setState.bind(stateHandler);
  }

  mapKeyDownEvent(keyMapper: KeyMap) {
    this._defineKeyboardControl(
      keyMapper,
      this._keyboardService.listenKeyDown.bind(this._keyboardService)
    );
  }

  mapKeyUpEvent(keyMapper: KeyMap) {
    this._defineKeyboardControl(
      keyMapper,
      this._keyboardService.listenKeyUp.bind(this._keyboardService)
    );
  }

  private _defineKeyboardControl(
    keyMapper: KeyMap,
    keyboardListener: (key: string) => Observable<string>
  ) {
    Object.entries(keyMapper).forEach(([key, getNewState]) => {
      keyboardListener(key).subscribe({
        next: () => {
          this._setState(this._props.view, getNewState());
        },
      });
    });
  }
}
