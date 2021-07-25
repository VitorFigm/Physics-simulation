import { State, View } from "@app/models";

export type MovingProps = {
  initialAcceleration: number;
  axis: "x" | `y`;
  maxVelocity?: number;
  friction?: number;
  initialVelocity?: number;
};

// public accelaration: number,
//     public axis: "x" | `y`,
//     private maxVelocity: number = null,
//     public friction = 0.01,
//     initialVelocity: number = 0

export class Moving extends State {
  velocity: number;
  acceleration: number;
  maxVelocity?: number;
  friction: number;
  axis: "x" | `y`;

  constructor(props: MovingProps) {
    super();
    this.velocity = props.initialVelocity ?? 0;
    this.friction = props.friction ?? 0.01;

    this.acceleration = props.initialAcceleration;
    this.axis = props.axis;
    this.maxVelocity = props.maxVelocity;
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
      this.velocity += this.acceleration;
    }
    this.velocity *= 1 - this.friction;
    view.position[this.axis] += this.velocity;
  }

  setAcceleration(newAccelaration: number) {
    this.acceleration = newAccelaration;
    return this;
  }

  stop() {
    this.acceleration = 0;
    return this;
  }

  private _canAccelerate() {
    const isVelocityMax =
      this.maxVelocity && Math.abs(this.velocity) >= Math.abs(this.maxVelocity);

    const isOposityAcceleration = this.velocity / this.acceleration < 0;
    return !isVelocityMax || isOposityAcceleration;
  }
}
