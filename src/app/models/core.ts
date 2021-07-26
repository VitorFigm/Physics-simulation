import { Jumping } from "app/controllers/states/jump/jumping.state";
import { Moving } from "app/controllers/states/move/moving.state";
import { Stading } from "app/controllers/states/standing.state";
import { View } from "./types";

export abstract class State {
  isMoving(): this is Moving {
    return false;
  }

  isJumping(): this is Jumping {
    return false;
  }

  isStanding(): this is Stading {
    return false;
  }

  onInit(previousState: State, view: View) {}

  onChange(nextState: State, view: View): string | boolean | void {}

  abstract construct(view: View): void;
}
