import { View } from "@app/models";
import {
  LEFT_DIRECTION,
  RIGHT_DIRECTION,
} from "app/services/next-frame/constants";
import { Jumping } from "../jumping/jumping.state";
import { State } from "../model/state.model";
import { FiniteStateMachine } from "../state-machine";

export interface MovingProps {
  stateMachine: FiniteStateMachine;
  maxVelocity?: number;
  initialAcceleration?: number;
  axis: "x" | "y" | "angle";
  friction?: number;
}

const DEFAULT_PROPS = {
  friction: 0.15,
  maxVelocity: 1000,
  initialAcceleration: 0,
};

export class Moving extends State {
  name = "moving";
  velocity: number = 0;
  acceleration: number;
  private _props: Required<MovingProps>;

  constructor(_props: MovingProps) {
    super(_props.stateMachine);
    this._props = { ...DEFAULT_PROPS, ..._props };
    this._validateMaxVelocity();
    this.acceleration = this._props.initialAcceleration;
  }

  listenActions() {
    this.setTransition({ from: "standing", on: "goLeft" });
    this.setTransition({ from: "standing", on: "goRight" });
    this.setTransition({
      from: "jumping",
      on: "endJump",
      do: (jumping: Jumping) => {
        this.velocity = jumping.movingX.velocity;
      },
    });
  }

  onInit = () => {
    this.velocity = 0;
    this.acceleration = this._props.initialAcceleration;

    this.on("goLeft", () => {
      this.accelerate(LEFT_DIRECTION);
    });

    this.on("goRight", () => {
      this.accelerate(RIGHT_DIRECTION);
    });
  };

  execute = (view: View, shoudlAccelerate: boolean = false) => {
    if (shoudlAccelerate) {
      this.accelerate();
    }

    this._applyFriction();
    this._limitVelocity();
    this._moveView(view);
  };

  accelerate = (direction?: 1 | -1) => {
    if (direction) {
      this.velocity += direction * Math.abs(this.acceleration);
      return;
    }

    this.velocity += this.acceleration;
  };

  private _moveView = (view: View) => {
    view.position[this._props.axis] += this.velocity;
  };

  private _limitVelocity() {
    if (Math.abs(this.velocity) > this._props.maxVelocity) {
      const currentDirection = Math.sign(this.velocity);
      this.velocity = currentDirection * this._props.maxVelocity;
    }
  }

  private _applyFriction() {
    this.velocity *= 1 - this._props.friction;
  }

  private _validateMaxVelocity() {
    if (this._props.maxVelocity < 0) {
      throw new Error("Max velocity must be greater or equal to 0");
    }
  }
}
