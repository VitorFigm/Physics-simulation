import { ControledView, View } from "@app/types";
import { Observable } from "@app/utils";
import { Injectable } from "app/core/inversion-of-control/inversion-of-control.engine";
import { walk } from "./walk/walking.state";

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
  get() {
    return {
      walk,
      stand,
    } as const;
  }

  set(view: ControledView, newState: State) {
    const isNewChangeAllowed = newState.onChange?.(view, newState);
    const initState = this._getNewStateSetter(view, newState);
    if (isNewChangeAllowed == undefined) {
      initState(true);
      return;
    }

    if (isNewChangeAllowed instanceof Observable) {
      isNewChangeAllowed.subscribe({
        next: initState,
      });
      return;
    }

    initState(isNewChangeAllowed);
  }

  private _getNewStateSetter(view: ControledView, newState: State) {
    return (isInitAllowed: boolean) => {
      if (isInitAllowed) {
        newState.onInit?.(view);
        view.state = newState;
      }
    };
  }
}

export type StateName = keyof ReturnType<StateHandler["get"]>;

export interface State {
  is(stateName: StateName): boolean;
  construct(view: View): void;
  transform?(internalState: Record<string, unknown>): State;
  onChange?(
    view: ControledView,
    newState: State
  ): boolean | Observable<boolean>;
  onInit?(view: ControledView): void;
}
