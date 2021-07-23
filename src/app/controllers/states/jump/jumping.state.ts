import { Context, State, View } from "@app/models";
import { Inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { Moving } from "../move/moving.state";
import { StateHandler } from "../state-handler";
import { mergeStates } from "../utils";

const GRAVITY = 0.1;

export class Jumping extends State {
  velocity: number;
  movingY: Moving;

  constructor(
    stateHandler: StateHandler,
    private _maxDistance: number,
    friction = 0.01
  ) {
    super();
    const initialVelocity = this.calculateInitialVelocity();
    const { Moving } = stateHandler.getStates();
    this.movingY = new Moving(-GRAVITY, "y", null, friction, initialVelocity);
  }

  isJumping() {
    return true;
  }
  calculateInitialVelocity() {
    return Math.sqrt(2 * GRAVITY * this._maxDistance);
  }

  construct(view: View) {
    this.movingY.construct(view);
    if (view.position.y <= 0) {
      view.position.y = 0;
      this.movingY.accelaration = 0;
      this.movingY.velocity = 0;
    }
  }

  onInit(previousState: State) {
    if (previousState.isMoving()) {
      const jumpingAndMoving = mergeStates(this, previousState, {
        isJumping: () => true,
        isMoving: () => true,
      });

      console.log(jumpingAndMoving.construct.toString());

      Object.assign(this, jumpingAndMoving);
    }
  }

  onChange(nextState: State, view: View) {
    if (view.position.y > 0) {
      return "block";
    }
  }
}
