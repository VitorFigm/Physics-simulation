import { View } from "app/types";
import { Subject } from "../../../utils/observable/observables";
import { State } from "./entity/state.model";

type Emission<T> = {
  action: T;
  data?: Record<string, unknown>;
};

interface ActionState extends Partial<State> {
  execute(view: View): void;
}

export class ActionEmitter {
  private _action$ = new Subject<Emission<string>>();
  action$ = this._action$.toObservable();

  emit(action: string, data?: Record<string, any>) {
    this._action$.next({ action, data });
  }
}

export class FiniteStateMachine extends ActionEmitter {
  private _state: ActionState;

  get currentState() {
    return this._state;
  }

  setState(state: ActionState, data?: unknown) {
    this._state?.clearSubscriptions?.();
    this._state = state;
    this._state.onInit?.(data);
  }

  executeRoutine(view: View) {
    this._state.execute(view);
  }

  getCurrentStateName() {
    return this._state?.name;
  }
}
