import { Subscription } from "@app/models";

type Mapper<T, R> = (value: T) => R;

type Sieve<T> = (value: T) => boolean;

type Callback<T> = (subscription: Subscription<T>) => void;

export class Observable<T> {
  subscribe(subscription: Subscription<T>) {
    this._callback(subscription);
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

  constructor(private _callback: Callback<T>) {}
}

export class Subject<T> {
  constructor() {
    const observable = new Observable<T>(({ next }) => {
      this.next = next;
    });
    this.toObservable = () => observable;
  }
  next(value: T) {
    throw new Error("Subject is not contructed yet");
  }
  toObservable: () => Observable<T>;
}

export const of = <T>(...values: T[]) => {
  return new Observable<T>(({ next }) => {
    values.forEach(next);
  });
};
