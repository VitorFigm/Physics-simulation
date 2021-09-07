import { View } from "@app/models";
import { of } from "@app/utils";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { NextFrameService } from "../next-frame/next-frame.service";

export class CollisionService {
  private _nextFrameService = inject(NextFrameService);

  private _observers: View[] = [];

  constructor() {}

  observeCollision(view: View) {
    this._observers.push(view);

    return this._nextFrameService.checkFramePass().flatMap(() => {
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

    return square1.checkIntercection(square2);
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

  private _setCoordinates(bottomLeft: Point, width: number, height: number) {
    this.position = {
      bottomLeft,
      topLeft: {
        x: bottomLeft.x,
        y: bottomLeft.y + height,
      },
      bottomRight: {
        x: bottomLeft.x + width,
        y: bottomLeft.y,
      },
      topRight: {
        x: bottomLeft.x + width,
        y: bottomLeft.y + height,
      },
    };
  }

  checkIntercection(square: ComparationSquare) {
    for (let point of Object.values(square.position)) {
      if (this.contains(point)) {
        return true;
      }
    }

    return false;
  }

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

type Point = { x: number; y: number };
