import { Observable, Subject } from "./../utils/observable/observables.model";
import { Attacking } from "app/controllers/states/attack/attacking.state";
import { Jumping } from "app/controllers/states/jump/jumping.state";
import { Moving } from "app/controllers/states/move/moving.state";
import { Stading } from "app/controllers/states/standing.state";
import { ImageLoader, View } from "./types";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { StateHandler } from "app/controllers/states/state-handler";

export abstract class State {
  private _stateControl = new Subject<boolean>();
  setState: StateHandler["setState"];

  constructor() {
    const stateHandler = inject(StateHandler);
    this.setState = stateHandler.setState.bind(stateHandler);
  }

  checkIfStateEnded() {
    return !this._stateControl.value;
  }

  watchStateEnd() {
    return this._stateControl.toObservable().filter((isStateStarting) => {
      return !isStateStarting;
    });
  }

  watchStateStart() {
    return this._stateControl.toObservable().filter((isStateStarting) => {
      return isStateStarting;
    });
  }

  startState() {
    this._stateControl.next(true);
  }

  endState() {
    this._stateControl.next(false);
  }

  isMoving(): this is Moving {
    return false;
  }

  isJumping(): this is Jumping {
    return false;
  }

  isStanding(): this is Stading {
    return false;
  }

  isAttacking(): this is Attacking {
    return false;
  }

  onInit(previousState: State, view: View) {}

  onChange(nextState: State, view: View): string | boolean | void {}

  abstract construct(view: View): void;
}

export class GraphicalAPI {
  imageLoader: ImageLoader;
  graphics: CanvasRenderingContext2D;
}
