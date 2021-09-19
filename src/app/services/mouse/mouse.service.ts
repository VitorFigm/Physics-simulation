import { Subject } from "@app/utils";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { toCartesianCoordinates } from "app/utils/position";
import { NextFrameService } from "../next-frame/next-frame.service";

type MousePosition = {
  x: number;
  y: number;
};

export class MouseService {
  private _nextFrameService = inject(NextFrameService);
  private _mouseMove$ = new Subject<MousePosition>();
  private _mouseDown$ = new Subject<MousePosition>();
  private _mouseUp$ = new Subject<MousePosition>();

  constructor() {
    addEventListener("mousemove", (event) => {
      this._onMouseEvent(event, this._mouseMove$);
    });

    addEventListener("mousedown", (event) => {
      this._onMouseEvent(event, this._mouseDown$);
    });

    addEventListener("mouseup", (event) => {
      this._onMouseEvent(event, this._mouseUp$);
    });
  }

  private get _mouseHold$() {
    let isHolding = false;

    this.observeMouseDown().subscribe({
      next: () => {
        isHolding = true;
      },
    });

    this.observeMouseUp().subscribe({
      next: () => {
        isHolding = false;
      },
    });

    return this._nextFrameService.checkFramePass().filter(() => {
      return isHolding;
    });
  }

  observeMouseMove() {
    return this._mouseMove$.toObservable();
  }

  observeMouseDown() {
    return this._mouseDown$.toObservable();
  }

  observeMouseUp() {
    return this._mouseUp$.toObservable();
  }

  observeMouseHold() {
    return this._mouseHold$;
  }

  private _onMouseEvent = (
    event: MouseEvent,
    subject$: Subject<MousePosition>
  ) => {
    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    subject$.next(toCartesianCoordinates(position));
  };
}
