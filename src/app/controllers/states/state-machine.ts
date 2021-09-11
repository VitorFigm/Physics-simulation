import { Action, Subscription, View } from "@app/models";
import { Observable, Subject } from "../../utils/observable/observables";
import { State } from "./model/state.model";

export class FiniteStateMachine {
  private _action$ = new Subject<Action>();
  private _state: State;

  constructor() {}

  action$ = this._action$.toObservable();

  setState(state: State, data?: unknown) {
    this._state?.clearSubscriptions();
    this._state = state;
    this._state.onInit(data);
  }

  executeRoutine(view: View) {
    this._state.execute(view);
  }

  emit(action: Action) {
    this._action$.next(action);
  }

  getCurrentStateName() {
    return this._state?.name;
  }
}
