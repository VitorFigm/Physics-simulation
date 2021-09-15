import { View } from "@app/models";
import { Subject } from "../../utils/observable/observables";
import { State } from "./model/state.model";

type Emission<T> = {
  action: T;
  data?: Record<string, unknown>;
};

export class FiniteStateMachine<Action = any, StateName = any> {
  private _action$ = new Subject<Emission<Action>>();
  private _state: State<Action, StateName>;

  get currentState() {
    return this._state;
  }

  constructor() {}

  action$ = this._action$.toObservable();

  setState<T extends string>(state: State<Action, T>, data?: unknown) {
    this._state?.clearSubscriptions();
    this._state = state as any;
    this._state.onInit(data);
  }

  executeRoutine(view: View) {
    this._state.execute(view);
  }

  emit(action: Action, data?: any) {
    this._action$.next({ action, data });
  }

  getCurrentStateName() {
    return this._state?.name as StateName;
  }
}
