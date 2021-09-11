import { Action, StateName, Subscription, View } from "@app/models";
import { FiniteStateMachine } from "../state-machine";

type TransitionOptions<DataType = unknown> = {
  from: StateName;
  on: Action;
  getData?: () => DataType;
};

export abstract class State {
  abstract name: StateName;
  private _subscriptions: Subscription[] = [];
  constructor(private stateMachine: FiniteStateMachine) {}

  abstract onInit(data: unknown): void;
  abstract execute(view: View): void;

  clearSubscriptions() {
    this._subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  on = (action: Action, callback: () => void) => {
    const subscription = this._filterEmittedActions(action).subscribe({
      next: callback,
    });

    this._subscriptions.push(subscription);
  };

  /**
   * Use this to declare when will a new state will start.
   * Exemple:
   * Supose i created a new class called NewState,
   * setting in the constructor ```setTransition({from:'previousState', on:'someAction'})```
   * means that, when a action named `someAction` is emited, if a state called `previousState`
   * is current setted in the stateMachine, the `NewState` object will be setted instead.
   */
  setTransition = (options: TransitionOptions) => {
    this._filterEmittedActions(options.on).subscribe({
      next: () => {
        if (this.stateMachine.getCurrentStateName() === options.from) {
          this.stateMachine.setState(this, options.getData?.());
        }
      },
    });
  };

  private _filterEmittedActions(action: Action) {
    return this.stateMachine.action$.filter((emittedAction) => {
      return emittedAction === action;
    });
  }
}
