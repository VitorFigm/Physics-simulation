import { BehaviorSubject, Observable, Subject } from "@app/utils";

export class NextFrameService {
  private _framePass$ = new Subject<boolean>();
  private _shouldStopAnimation: boolean = false;

  constructor() {
    this._setFramePassListener();
  }

  private _setFramePassListener() {
    requestAnimationFrame(() => {
      if (!this._shouldStopAnimation) {
        this._framePass$.next(true);
        this._setFramePassListener();
      }
    });
  }

  checkFramePass() {
    return this._framePass$.toObservable();
  }
}
