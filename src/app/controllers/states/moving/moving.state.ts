import { FighterAction, FighterStateName, View } from "@app/models";
import { Jumping } from "../jumping/jumping.state";
import { State } from "../model/state.model";
import { FiniteStateMachine } from "../state-machine";

interface MovingProps {
  shouldSetTransitions?: boolean;
  stateMachine: FiniteStateMachine;
  maxVelocity?: number;
  initialAcceleration: number;
  axis: "x" | "y" | "angle";
  friction?: number;
}

const DEFAULT_PROPS = {
  shouldSetTransitions: true,
  friction: 0.15,
  maxVelocity: 1000,
};

export class Moving extends State<FighterAction, FighterStateName> {
  name: FighterStateName = "moving";
  velocity: number = 0;
  acceleration: number;
  private _props: Required<MovingProps>;

  constructor(_props: MovingProps) {
    super(_props.stateMachine);
    this._props = { ...DEFAULT_PROPS, ..._props };
    this._validateMaxVelocity();
    this.acceleration = this._props.initialAcceleration;

    if (this._props.shouldSetTransitions) {
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
  }

  onInit = () => {
    this.velocity = 0;
    this.acceleration = this._props.initialAcceleration;

    this.on("goLeft", () => {
      this.accelerate("left");
    });

    this.on("goRight", () => {
      this.accelerate("right");
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

  accelerate = (direction?: "left" | "right") => {
    if (direction) {
      const sign = direction === "right" ? 1 : -1;
      console.log(sign);
      this.velocity += sign * Math.abs(this.acceleration);
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
