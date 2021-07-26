import { ControledView, State, View } from "@app/models";
import { Observable } from "@app/utils";
import { StateHandler } from "app/controllers/states/state-handler";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { KeyboardService } from "app/services/keyboard/keyboard.service";

type KeyboardControlProps = {
  view: ControledView;
};

type KeyMap = Record<string, () => State>;

/**
 * This services sets state of a view based on which key are pressed
 * It needs to be instanciated with a key mapper, a object that, for each key strings
 * containing a keyboard key, has a function that return a state to be seted
 * */

export class KeyboardControl {
  private _setState: (view: ControledView, newState: State) => void;

  private _keyboardService = inject(KeyboardService);

  constructor(private props: KeyboardControlProps) {
    const { setState } = inject(StateHandler);
    this._setState = setState;
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
          this._setState(this.props.view, getNewState());
        },
      });
    });
  }
}
