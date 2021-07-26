import { Observable } from "@app/utils";

export class NextFrameService {
  private _framePass$: Observable<boolean>;

  private _isObservingFraming = true;

  constructor() {
    this._framePass$ = new Observable<boolean>(({ next }) => {
      this._getRecursiveCallback(next)();
    });
  }

  private _getRecursiveCallback(next: (param: boolean) => void) {
    return () => {
      next(true);
      if (this._isObservingFraming) {
        requestAnimationFrame(this._getRecursiveCallback(next));
      }
    };
  }

  checkFramePass() {
    return this._framePass$;
  }

  stopFrameObservation() {
    this._isObservingFraming = false;
  }

  startFrameObservation() {
    this._isObservingFraming = true;
  }
}
