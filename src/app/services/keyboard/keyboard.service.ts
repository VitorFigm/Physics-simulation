import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { Observable, of, Subject } from "@app/utils";
import { NextFrameService } from "../next-frame/next-frame.service";

type EventName = "keydown" | "keyup" | "keypress";

type ActionKeys = "left" | "right" | "up" | "attack";

const DEAFULT_KEY_MAP: Record<string, ActionKeys> = {
  a: "left",
  d: "right",
  w: "up",
  space: "attack",
};

export class KeyboardService {
  private _keydown$ = new Subject<string>();
  private _keyup$ = new Subject<string>();
  private _pressedKeys = new Map<string, boolean>();
  private _nextFrameService = inject(NextFrameService);
  private _keyMap = DEAFULT_KEY_MAP;

  private observableMap: Record<EventName, Observable<string>> = {
    keydown: this._keydown$.toObservable(),
    keyup: this._keyup$.toObservable(),
    keypress: this._keypress$,
  };

  constructor() {
    this._setKeyDownListener();
    this._setKeyUpListener();
  }

  listen = (event: EventName, key: ActionKeys) => {
    return this.observableMap[event]
      .filter((value) => value === key)
      .map(Boolean);
  };

  setNewKeyMap(keyboardKey: string) {}

  /**
   * Emits values to `_keydown``each time the user hit the key.
   * It just emit at the moment the key is hit, wait the user to release it to be possible another emission.
   */
  private _setKeyDownListener() {
    addEventListener("keydown", (event) => {
      const key = this._threatKeys(event.key);
      if (!this._pressedKeys.has(key)) {
        this._pressedKeys.set(key, true);
        this._keydown$.next(key);
      }
    });
  }

  private _setKeyUpListener() {
    addEventListener("keyup", (event) => {
      const key = this._threatKeys(event.key);
      this._keyup$.next(key);
      this._pressedKeys.delete(key);
    });
  }

  private get _keypress$() {
    return this._nextFrameService.checkFramePass().mergeMap(() => {
      return of(...this._pressedKeys.keys());
    });
  }

  private _threatKeys(key: string) {
    if (key === " ") {
      return "space";
    }

    const formatedKey = key === " " ? "space" : key.toLocaleLowerCase();

    return this._mapKey(formatedKey);
  }

  private _mapKey(key: string) {
    return this._keyMap[key];
  }
}
