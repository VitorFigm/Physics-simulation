import { View } from "app/types";
import { of } from "@app/utils";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";

import { Polygon } from "app/utils/math/geometry/polygon/polygon";
import { NextFrameService } from "../next-frame/next-frame.service";

export class CollisionService {
  private _nextFrameService = inject(NextFrameService);

  private _observers: View[] = [];

  constructor() {}

  observeCollision(view: View) {
    this._observers.push(view);

    return this._nextFrameService.checkFramePass().mergeMap(() => {
      return of(...this.getColliders(view));
    });
  }

  private getColliders(observer: View) {
    const coliders: View[] = [];
    this._observers.forEach((possibleCollider) => {
      if (
        observer != possibleCollider &&
        this.checkCollision(observer, possibleCollider)
      ) {
        coliders.push(possibleCollider);
      }
    });

    return coliders;
  }

  private checkCollision(player1: View, player2: View) {
    const polygon1 = Polygon.fromView(player1);

    const polygon2 = Polygon.fromView(player2);

    return polygon1.intersects(polygon2);
  }
}
