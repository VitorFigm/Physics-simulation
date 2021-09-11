import { StateName, View } from "@app/models";
import { State } from "../model/state.model";
import { FiniteStateMachine } from "../state-machine";

interface MovingProps {
  stateMachine: FiniteStateMachine;
  maxVelocity?: number;
  acceleration: number;
  axis: "x" | "y";
  friction?: number;
}

const DEFAULT_PROPS = {
  friction: 0.15,
  maxVelocity: 1000,
};

export class Moving extends State {
  name: StateName = "moving";
  velocity: number = 0;
  constructor(private _props: MovingProps) {
    super(_props.stateMachine);
    this._props = { ...DEFAULT_PROPS, ..._props };
    this._validateMaxVelocity();

    this.setTransition({ from: "standing", on: "goLeft" });
    this.setTransition({ from: "standing", on: "goRight" });
  }

  onInit = () => {
    this.velocity = 0;
    this.on("goLeft", () => {
      this.accelerate("left");
    });

    this.on("goRight", () => {
      console.log("test");
      this.accelerate("right");
    });
  };

  execute = (view: View) => {
    this._applyFriction();
    this._limitVelocity();
    this._moveView(view);
  };

  accelerate = (direction: "left" | "right") => {
    const sign = direction === "right" ? 1 : -1;
    this.velocity += sign * this._props.acceleration;
  };

  private _moveView = (view: View) => {
    view.position[this._props.axis] += this.velocity;
  };

  private _limitVelocity() {
    if (Math.abs(this.velocity) > this._props.maxVelocity) {
      console.log("limit");
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
