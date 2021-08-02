import { State, View } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { Moving } from "../move/moving.state";

type JumpingProps = {
  maxDistance: number;
  friction?: number;
  gravity?: number;
};

const DEFAULT_PROPS: Partial<JumpingProps> = {
  friction:0,
  gravity: 0.7
}

export class Jumping extends State {
  movingY: Moving;
  movingX: Moving;



  constructor(private _props: JumpingProps) {
    super();
    this._props = {...DEFAULT_PROPS, ...this._props}
    const initialVelocity = this.calculateInitialVelocity();

    this.movingY = inject(Moving, {
      friction:this._props.friction,
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
    const initalJumpVelocity = this.calculateInitialVelocity();
    
    this.movingY.setVelocity(initalJumpVelocity);
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
    this.movingY.construct(view);
    this.movingX.construct(view);
    if (view.position.y < 0) {
      view.position.y = 0;
      this.movingY.stop();
    }
  }

  onChange(nextState: State, view: View) {
    const negligibleVelocity = 0.001
    
    if (view.position.y > 0) {
      if (nextState.isMoving()) {

        this.movingX.setAcceleration(nextState.acceleration);
        nextState.stop();
      }

      if(!nextState.isStanding()){
        return "block";
      }
    }
  }

  calculateInitialVelocity() {
    return Math.sqrt(2 *this._props.gravity * this._props.maxDistance);
  }

}
