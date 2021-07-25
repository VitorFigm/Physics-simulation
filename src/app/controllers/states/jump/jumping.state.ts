import { State, View } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { Moving } from "../move/moving.state";

type JumpingProps = {
  maxDistance: number;
  friction?: number;
  gravity?: number;
};

export class Jumping extends State {
  velocity: number;
  movingY: Moving;
  movingX: Moving;
  private _gravity: number;
  private _maxDistance: number;

  constructor(props: JumpingProps) {
    super();
    this._maxDistance = props.maxDistance;
    const initialVelocity = this.calculateInitialVelocity();

    const friction = props.friction ?? 0.01;
    this._gravity = props.gravity ?? 0.01;

    this.movingY = inject(Moving, {
      friction,
      initialVelocity,
      axis: "y",
      initialAcceleration: -this._gravity,
    });

    this.movingX = inject(Moving, {
      axis: "x",
      initialAcceleration: 0,
    });
  }

  isJumping() {
    return true;
  }
  calculateInitialVelocity() {
    return Math.sqrt(2 * this._gravity * this._maxDistance);
  }

  construct(view: View) {
    this.movingY.construct(view);
    this.movingX.construct(view);

    if (view.position.y < 0) {
      view.position.y = 0;
      this.movingY.acceleration = 0;
      this.movingY.velocity = 0;
    }
  }

  onInit(previousState: State) {
    this.movingY.velocity = this.calculateInitialVelocity();
    this.movingY.acceleration = -this._gravity;

    if (previousState.isMoving()) {
      const previousMoving = previousState as Moving;
      this.movingX.velocity = previousMoving.velocity;
      previousMoving.stop();
    }
  }

  onChange(nextState: State, view: View) {
    if (view.position.y > 0) {
      return "block";
    }
  }
}
