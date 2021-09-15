import { Point, View } from "@app/models";
import { of } from "@app/utils";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { NextFrameService } from "../next-frame/next-frame.service";

/**
 * @TODO consider the rotation
 */

export class CollisionService {
  private _nextFrameService = inject(NextFrameService);

  private _observers: View[] = [];

  constructor() {}

  observeCollision(view: View) {
    this._observers.push(view);

    return this._nextFrameService.checkFramePass().concatMap(() => {
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
    const square1 = new ComparationSquare(player1);
    const square2 = new ComparationSquare(player2);

    return square1.checkIntercectionWith(square2);
  }
}

class ComparationSquare {
  position: {
    topLeft: Point;
    bottomLeft: Point;
    bottomRight: Point;
    topRight: Point;
  };

  constructor(view: View) {
    const { x, y } = view.position;
    const { width, height } = view.box;
    this._setCoordinates({ x, y }, width, height);
  }

  private _setCoordinates(reference: Point, width: number, height: number) {
    this.position = {
      bottomLeft: {
        x: reference.x - width / 2,
        y: reference.y,
      },
      topLeft: {
        x: reference.x - width / 2,
        y: reference.y + height,
      },
      bottomRight: {
        x: reference.x + width / 2,
        y: reference.y,
      },
      topRight: {
        x: reference.x + width / 2,
        y: reference.y + height,
      },
    };
  }

  /**
   * If any of the points in a square's conner is inside other square, then those square are intersecting.
   * This function then uses this logic to check if other ComparationSquare intersects this ComparationSquare
   */
  checkIntercectionWith(square: ComparationSquare) {
    for (let point of Object.values(square.position)) {
      if (this.contains(point)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks if a point is inside the ComparationSquare region
   */

  contains(point: Point) {
    const { bottomLeft, topRight } = this.position;
    return (
      this._isValueInInterval(point.x, bottomLeft.x, topRight.x) &&
      this._isValueInInterval(point.y, bottomLeft.y, topRight.y)
    );
  }
  private _isValueInInterval(value: number, start: number, end: number) {
    return value >= start && value <= end;
  }
}
