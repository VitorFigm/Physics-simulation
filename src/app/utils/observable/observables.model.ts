import { Subscription } from "@app/models";

type Mapper<T, R> = (value: T) => R;

type Tapper<T> = (value: T) => void;

type Sieve<T> = (value: T) => boolean;

type Callback<T> = (subscription: Subscription<T>) => void;

export class Observable<T> {
  constructor(private _callback: Callback<T>) {}

  subscribe(subscription: Subscription<T>) {
    const { threatedSubscription, unsubscribe } =
      this._threatSubscription(subscription);

    this._callback(threatedSubscription);

    return { unsubscribe };
  }

  /**
   * Transform the value emited from a observable
   */
  map<R>(mapper: Mapper<T, R>) {
    return new Observable<R>((subscription) => {
      const subscriptionMapper: Subscription<T> = {
        next(value: T) {
          subscription.next(mapper(value));
        },
        error(error) {
          subscription.error(error);
        },
      };

      this.subscribe(subscriptionMapper);
    });
  }

  tap(tapper: Tapper<T>) {
    return this.map((value) => {
      tapper(value);
      return value;
    });
  }

  /**
   * Flatten high order observable.
   * When we have a observable that emits another observable, will concat two of thoses into
   * one single observable
   */
  flatMap<R>(flatMapper: Mapper<T, Observable<R>>) {
    return new Observable<R>((subscription) => {
      const subscriptionMapper: Subscription<T> = {
        next(value: T) {
          flatMapper(value).subscribe(subscription);
        },
        error(error) {
          subscription.error(error);
        },
      };

      this.subscribe(subscriptionMapper);
    });
  }

  /**
   * Prevent observable to emit values that do follow
   * some criteria from a sieve function
   */

  filter(callback: Sieve<T>) {
    return new Observable<T>((subscription) => {
      const subscriptionSieve: Subscription<T> = {
        next(value: T) {
          if (callback(value)) {
            subscription.next(value);
          }
        },
        error(error) {
          subscription.error(error);
        },
      };

      this.subscribe(subscriptionSieve);
    });
  }

  private _threatSubscription(subscription: Subscription<T>) {
    let isSubscribed = true;
    const unsubscribe = () => {
      isSubscribed = false;
    };

    const threatedSubscription: Subscription<T> = {
      next: (value) => {
        if (isSubscribed) {
          subscription.next(value);
        }
      },
      error: subscription.error,
    };

    return {
      threatedSubscription,
      unsubscribe,
    };
  }
}

export class Subject<T> {
  value: T;

  private _subscriptions: Subscription<T>[] = [];

  constructor() {
    const observable = new Observable<T>((subscription) => {
      this._subscriptions.push(subscription);
    });

    this.toObservable = () => observable;
  }
  next(value: T) {
    this.value = value;
    this._subscriptions.forEach((subscription) => {
      subscription.next(value);
    });
  }

  toObservable: () => Observable<T>;
}

export class BehaviorSubject<T> extends Subject<T> {
  constructor(private _initialValue: T) {
    super();
    this.value = this._initialValue;
  }
}

export const of = <T>(...values: T[]) => {
  return new Observable<T>(({ next }) => {
    values.forEach(next);
  });
};
