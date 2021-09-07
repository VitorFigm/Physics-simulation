import { State, View } from "@app/models";
import { BehaviorSubject, Subject } from "@app/utils";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { DEFAULT_CONSISTENT_FRAME_RATE } from "app/services/next-frame/constants";
import { Moving } from "../move/moving.state";

const NEGLIGIBLE_VELOCITY = 0.3;

type AttackingProps = {
  duration: number;
};
export class Attacking extends State {
  canDealDamage = false;
  private _movingX: Moving;
  private _friction: number = 0.05;
  direction: number = 1;

  constructor(private _props: AttackingProps) {
    super();

    this._movingX = inject(Moving, {
      axis: "x",
      initialAcceleration: 0,
      friction: this._friction,
    });
  }

  onInit(previousState: State) {
    if(previousState instanceof Moving){
      this.direction = Math.sign(previousState.velocity)
    }

    this._movingX.velocity = this._calculateInitialVelocity();
    this.startState();
  }

  getVelocity(){
    return this._movingX.velocity
  }

  onChange(newState: State) {
    if (!this.checkIfStateEnded()) {
      return "block";
    } else {
      console.log(newState);
    }
  }

  construct(view: View) {
    this._movingX.construct(view);
    this._handleStateEnding();
  }

  private _handleStateEnding() {
    if (
      !this.checkIfStateEnded() &&
      Math.abs(this._movingX.velocity) <= NEGLIGIBLE_VELOCITY
    ) {
      this.endState();
    }
  }

  private _calculateInitialVelocity() {
    const duration = this._props.duration * DEFAULT_CONSISTENT_FRAME_RATE;
    const velocity =
      NEGLIGIBLE_VELOCITY /
      (1 - NEGLIGIBLE_VELOCITY * duration * this._friction);

    return this.direction*Math.abs(velocity);
  }
}
