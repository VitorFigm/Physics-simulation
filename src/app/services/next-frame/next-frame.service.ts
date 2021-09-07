import { BehaviorSubject, Observable } from "@app/utils";
import { DEFAULT_CONSISTENT_FRAME_RATE, MILLISECONDS_IN_A_SECOND } from "./constants";

export class NextFrameService {
  private _smoothFramePass$: Observable<boolean>;
  private _consistentFramePass$: Observable<number>;
  private _isObservingFraming: boolean = true;

  private _consistentBaseFrameRate = DEFAULT_CONSISTENT_FRAME_RATE;

  constructor() {
    const callback = this._getRecursiveCallback();
    this._smoothFramePass$ = new Observable<boolean>(({ next }) => {
      callback(next);
    });

    this.setConsistentCallback();
  }

  private _getRecursiveCallback() {
    const callback = (next: (param: boolean) => void) => {
      next(true);
      if (this._isObservingFraming) {
        requestAnimationFrame(() => {
          callback(next);
        });
      }
    };

    return callback;
  }

  private setConsistentCallback() {
    const consistentFramePass$ = new BehaviorSubject<number>(0);

    this._consistentFramePass$ = consistentFramePass$.toObservable();

    const step = Math.round(
      MILLISECONDS_IN_A_SECOND / this._consistentBaseFrameRate
    );

    setInterval(() => {
      consistentFramePass$.next(consistentFramePass$.value + 1);
    }, step);
  }

  checkFramePass(fps: number = null) {
    if (!fps) {
      return this._smoothFramePass$;
    }
    return this._getAdjustedFrameEmitter(fps).map(Boolean);
  }

  private _getAdjustedFrameEmitter(fps: number) {
    const step = Math.round(this._consistentBaseFrameRate / fps);

    return this._consistentFramePass$.filter((time) => {
      return time % step === 0;
    });
  }

  stopFrameObservation() {
    this._isObservingFraming = false;
  }
}
