import { Subject } from "@app/utils";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { toCartesianCoordinates } from "app/utils/position";
import { NextFrameService } from "../next-frame/next-frame.service";

type MousePosition = {
  x: number;
  y: number;
};

export class MouseService {
  nextFrameService = inject(NextFrameService);
  private _mouseMove$ = new Subject<MousePosition>();

  constructor() {
    addEventListener("mousemove", (event) => {
      const position = {
        x: event.clientX,
        y: event.clientY,
      };

      this._mouseMove$.next(toCartesianCoordinates(position));
    });
  }

  observeMouseMove() {
    return this._mouseMove$.toObservable();
  }
}
