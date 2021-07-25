import { View } from "./types";

export abstract class State {
  isMoving() {
    return false;
  }

  isJumping() {
    return false;
  }

  isStanding() {
    return false;
  }

  onInit(previousState: State, view: View) {}

  onChange(nextState: State, view: View): string | boolean | void {}

  abstract construct(view: View): void;
}
