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

    this._gravity = props.gravity ?? 0.1;

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

  construct(view: View) {
    this.movingY.construct(view);
    this.movingX.construct(view);

    if (view.position.y < 0) {
      view.position.y = 0;

      this.movingY.setAcceleration(0);
      this.movingY.setVelocity(0);
    }
  }

  onInit(previousState: State) {
    const initalJumpVelocity = this.calculateInitialVelocity();
    this.movingY.setVelocity(initalJumpVelocity);
    this.movingY.setAcceleration(-this._gravity);

    if (previousState.isMoving()) {
      this.movingX.setVelocity(previousState.velocity);
      previousState.stop();
    }
  }

  onChange(nextState: State, view: View) {
    if (view.position.y > 0) {
      return "block";
    }
  }

  calculateInitialVelocity() {
    return Math.sqrt(2 * this._gravity * this._maxDistance);
  }

  getState() {
    const { velocity } = this;
    return { velocity };
  }

  setVelocity(newVelocity: number) {
    this.velocity = newVelocity;
  }

  bounce() {
    this.movingX.bounce();
    this.movingY.invertVelocity();
    const bounceAccelaration = this._gravity * 3;
    this.movingY.velocity += bounceAccelaration;
  }
}
