import { State, View } from "@app/models";
import { Injectable } from "app/core/inversion-of-control/inversion-of-control.engine";

export class Moving extends State {
  velocity: number;
  constructor(
    public accelaration: number,
    public axis: "x" | `y`,
    private maxVelocity: number = null,
    public friction = 0.01,
    initialVelocity: number = 0
  ) {
    super();
    this.velocity = initialVelocity;
  }
  isMoving() {
    return true;
  }

  onInit(previousState: State) {
    if (previousState instanceof Moving) {
      this.velocity = previousState.velocity;
    }
  }

  construct(view: View) {
    if (this._canAccelerate()) {
      this.velocity += this.accelaration;
    }
    this.velocity *= 1 - this.friction;
    view.position[this.axis] += this.velocity;
  }

  setAcceleration(newAccelaration: number) {
    this.accelaration = newAccelaration;
    return this;
  }

  stop() {
    this.accelaration = 0;
    return this;
  }

  private _canAccelerate() {
    const isVelocityMax =
      this.maxVelocity && Math.abs(this.velocity) >= Math.abs(this.maxVelocity);

    const isOposityAcceleration = this.velocity / this.accelaration < 0;
    return !isVelocityMax || isOposityAcceleration;
  }
}
