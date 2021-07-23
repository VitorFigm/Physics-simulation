import { ControledView, State, View } from "@app/models";
import { Observable } from "@app/utils";
import { Injectable } from "app/core/inversion-of-control/inversion-of-control.engine";
import { Moving } from "./move/moving.state";
import { Jumping } from "./jump/jumping.state";

class Stading extends State {
  isStanding() {
    return true;
  }
  construct() {}
}

@Injectable({ token: StateHandler, singleton: true })
export class StateHandler {
  getStates() {
    return {
      Moving,
      Stading,
      Jumping,
    } as const;
  }

  setState(view: ControledView, newState: State) {
    const blockChange = view.state.onChange(newState, view);

    if (!blockChange) {
      newState.onInit(view.state, view);

      view.state = newState;
    }
  }
}

/**
 * Use this to compose state and implements watch function
 */
