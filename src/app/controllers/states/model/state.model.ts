import { Subscription, View } from "@app/models";
import { FiniteStateMachine } from "../state-machine";

type TransitionOptions<
  DataType = Record<string, unknown>,
  Action = string,
  StateName = string
  > = {
    from: StateName;
    on: Action;
    do?: (previousState: any) => DataType | void;
  };

export abstract class State<Action, StateName> {
  abstract name: StateName;

  private _subscriptions: Subscription[] = [];
  constructor(private stateMachine: FiniteStateMachine<Action, StateName>) { }

  abstract onInit(data: unknown): void;
  abstract execute(view: View): void;
  abstract listenActions(): void

  clearSubscriptions() {
    this._subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  on = (action: Action, callback: (data?: Record<string, any>) => void) => {
    const subscription = this._filterEmittedActions(action).subscribe({
      next: ({ data }) => {
        callback(data);
      },
    });

    this._subscriptions.push(subscription);
  };

  /**
   * # Description
   * Use this to declare when will a new state will start.
   * Exemple:
   * Supose i created a new class called NewState,
   * setting in the constructor ```setTransition({from:'previousState', on:'someAction'})```
   * means that, when a action named `someAction` is emited, if a state called `previousState`
   * is current setted in the stateMachine, the `NewState` object will be setted instead.
   *
   * # Do
   * If a callback is passed to `do`, the data returned from the callback will by passed as
   * argument to the onInit function of the State object implementing this transition. The previousState
   * will be passed as argument of the callback
   */
  setTransition = <D>(options: TransitionOptions<D, Action, StateName>) => {
    this._filterEmittedActions(options.on as Action).subscribe({
      next: ({ data }) => {
        if (
          (this.stateMachine.getCurrentStateName() as StateName) ===
          options.from
        ) {
          this.stateMachine.setState(this as any, {
            ...options.do?.(this.stateMachine.currentState),
            ...data,
          });
        }
      },
    });
  };

  private _filterEmittedActions(action: Action) {
    return this.stateMachine.action$.filter((emittedAction) => {
      return (emittedAction.action as Action) === action;
    });
  }
}
