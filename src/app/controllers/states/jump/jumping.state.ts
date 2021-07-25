import { State, View } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { Moving } from "../move/moving.state";

const GRAVITY = 0.1;

type JumpingProps = {
  maxDistance: number;
  friction?: number;
};

export class Jumping extends State {
  velocity: number;
  movingY: Moving;
  movingX: Moving;
  private _maxDistance: number;

  constructor(props: JumpingProps) {
    super();
    this._maxDistance = props.maxDistance;
    const initialVelocity = this.calculateInitialVelocity();

    const friction = props.friction ?? 0.01;

    this.movingY = inject(Moving, {
      friction,
      initialVelocity,
      axis: "y",
      initialAcceleration: -GRAVITY,
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
    return Math.sqrt(2 * GRAVITY * this._maxDistance);
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
    this.movingY.acceleration = -GRAVITY;

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
