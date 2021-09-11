import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { Observable, of, Subject } from "@app/utils";
import { NextFrameService } from "../next-frame/next-frame.service";
import { PROCESS_FRAME_RATE } from "../next-frame/constants";

export class KeyboardService {
  private _keydown$ = new Subject<string>();
  private _keyup$ = new Subject<string>();

  private _nextFrameService = inject(NextFrameService);

  constructor() {
    addEventListener("keydown", (event) => {
      this._keydown$.next(event.key.toLocaleLowerCase());
    });

    addEventListener("keyup", (event) => {
      this._keyup$.next(event.key.toLocaleLowerCase());
    });
  }

  private get _keypress$() {
    const pressedKeys = new Map();

    this._keydown$.toObservable().subscribe({
      next: (key) => {
        pressedKeys.set(key, true);
      },
    });

    this._keyup$.toObservable().subscribe({
      next: (key) => {
        pressedKeys.delete(key);
      },
    });

    return this._nextFrameService
      .checkFramePass(PROCESS_FRAME_RATE)
      .concatMap(() => {
        return of(...pressedKeys.keys());
      });
  }

  listenKeyPress = (key: string) => {
    return this._keypress$.filter((value) => value === key);
  };

  listenKeyUp = (key: string) => {
    return this._keyup$.toObservable().filter((value) => value === key);
  };
}
