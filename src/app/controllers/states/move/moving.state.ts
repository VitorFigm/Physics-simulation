import { State, View } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { Stading } from "../standing.state";

const NEGLIGIBLE_VELOCITY = 0.5;

export type MovingProps = {
  initialAcceleration: number;
  axis: "x" | `y`;
  maxVelocity?: number;
  friction?: number;
  initialVelocity?: number;
};

const DEFAULT_PROPS: Partial<MovingProps> = {
  friction: 0.08,
  initialVelocity: 0,
};

// public accelaration: number,
//     public axis: "x" | `y`,
//     private maxVelocity: number = null,
//     public friction = 0.01,
//     initialVelocity: number = 0

export class Moving extends State {
  acceleration: number;
  velocity: number;

  constructor(private _props: MovingProps) {
    super();
    this._props = { ...DEFAULT_PROPS, ..._props };

    this.acceleration = this._props.initialAcceleration;
    this.velocity = this._props.initialVelocity;
  }

  isMoving() {
    return true;
  }

  onInit(previousState: State, _: View) {
    if (previousState.isMoving()) {
      this.velocity = previousState.velocity;
    }
  }

  construct(view: View) {
    this._handleStateStarting();

    if (this.velocity >= 0) {
      view.direction = "left";
    } else {
      view.direction = "right";
    }

    if (this._canAccelerate()) {
      this.velocity += this.acceleration;
    }
    this.velocity = this._applyFriction(this.velocity);
    view.position[this._props.axis] += this.velocity;

    this._handleStateEnding(view);
  }

  private _handleStateStarting() {
    if (
      Math.abs(this.velocity) > NEGLIGIBLE_VELOCITY &&
      this.checkIfStateEnded()
    ) {
      this.startState();
    }
  }

  private _handleStateEnding(view: View) {
    if (
      Math.abs(this.velocity) < NEGLIGIBLE_VELOCITY &&
      !this.checkIfStateEnded()
    ) {
      this.endState();
    }
  }

  private _applyFriction(velocity: number) {
    const vectorNorm = Math.abs(velocity); // Modulus(or norm) of vector
    const direction = Math.sign(velocity);

    return direction * (vectorNorm - this._props.friction * vectorNorm ** 2);
  }

  setAcceleration(newAccelaration: number) {
    this.acceleration = newAccelaration;
    return this;
  }

  setVelocity(newVelocity: number) {
    this.velocity = newVelocity;
    return this;
  }

  stop() {
    this.acceleration = 0;
    return this;
  }

  invertAcceleration() {
    this.acceleration = -this.acceleration;
  }

  invertVelocity() {
    this.velocity = -this.velocity;
  }

  private _canAccelerate() {
    const isVelocityMax =
      this._props.maxVelocity &&
      Math.abs(this.velocity) >= Math.abs(this._props.maxVelocity);

    const isOposityAcceleration = this.velocity / this.acceleration < 0;
    return !isVelocityMax || isOposityAcceleration;
  }
}
