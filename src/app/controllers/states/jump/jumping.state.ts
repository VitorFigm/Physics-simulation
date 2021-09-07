import { State, View } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { DEFAULT_CONSISTENT_FRAME_RATE } from "app/services/next-frame/constants";
import { Moving } from "../move/moving.state";

type JumpingProps = {
  duration: number;
  friction?: number;
  gravity?: number;
};

const DEFAULT_PROPS: Partial<JumpingProps> = {
  friction: 0,
  gravity: 0.7,
};

export class Jumping extends State {
  movingY: Moving;
  movingX: Moving;
  initialTime: any;
  time: any;

  constructor(private _props: JumpingProps) {
    super();
    this._props = { ...DEFAULT_PROPS, ...this._props };
    const initialVelocity = this.calculateInitialVelocity();

    this.movingY = inject(Moving, {
      friction: this._props.friction,
      initialVelocity,
      axis: "y",
      initialAcceleration: -this._props.gravity,
    });

    this.movingX = inject(Moving, {
      axis: "x",
      initialAcceleration: 0,
    });
  }

  onInit(previousState: State) {
    this.initialTime = Date.now();
    this.startState();
    const initialJumpVelocity = this.calculateInitialVelocity();

    this.movingY.setVelocity(initialJumpVelocity);
    this.movingY.setAcceleration(-this._props.gravity);

    if (previousState.isMoving()) {
      this.movingX.setVelocity(previousState.velocity);
      this.movingX.setAcceleration(previousState.acceleration);
    }
  }

  isJumping() {
    return true;
  }

  construct(view: View) {
    this.time = Date.now();
    if (!this.checkIfStateEnded()) {
      this.movingY.construct(view);
      this.movingX.construct(view);
    }

    this._handleStateEnding(view);
  }

  private _handleStateEnding(view: View) {
    if (view.position.y <= 0 && !this.checkIfStateEnded()) {
      view.position.y = 0;
      this.movingY.stop();
      this.endState();
    }
  }

  getJumpingXVelocity(): number {
    return this.movingX.velocity;
  }

  onChange(nextState: State, view: View) {
    if (view.position.y > 0) {
      if (!nextState.isStanding()) {
        console.log(!nextState.isStanding());
        return "block";
      }
    }
  }

  calculateInitialVelocity() {
    return (
      ((this._props.duration * DEFAULT_CONSISTENT_FRAME_RATE) / 2) *
      this._props.gravity
    );
  }
}
