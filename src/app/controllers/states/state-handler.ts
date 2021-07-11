import { ControledView, View } from "@app/types";
import { Observable } from "@app/utils";
import { Injectable } from "app/core/inversion-of-control/inversion-of-control.engine";
import { move } from "./move/moving.state";
import { jump } from "./jump/jumping.state";

export const stand = (): State => {
  return {
    construct() {},
    is(stateName) {
      return stateName === "stand";
    },
  };
};

@Injectable({ token: StateHandler, singleton: true })
export class StateHandler {
  getStates() {
    return {
      move,
      stand,
      jump,
    } as const;
  }

  setState(view: ControledView, newState: State) {
    const blockChange = view.state.onChange?.(view, newState);

    if (!blockChange) {
      newState.onInit?.(view, view.state);
      view.state = newState;
    }
  }
}

export type StateName = keyof ReturnType<StateHandler["getStates"]> | "merge";

export interface State<InternalState = unknown> {
  is(stateName: StateName): boolean;
  construct(view: View): void;
  transform?(
    this: State<InternalState>,
    internalState: InternalState
  ): State<InternalState>;

  getInternalState?(): InternalState;

  onChange?(
    this: State<InternalState>,
    view: ControledView,
    newState: State
  ): void | "block";
  onInit?(view: ControledView, previousState?: State): void;
}

/**
 * Use this to compose state and implements watch function
 */
