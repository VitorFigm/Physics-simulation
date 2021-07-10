import { Subscription } from "@app/types";

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
   * Prevent observable to emit values that do follow
   * some criteria from a sieve function
   */

  filter(sieve: Sieve<T>) {
    return new Observable<T>((subscription) => {
      const subscriptionSieve: Subscription<T> = {
        next(value: T) {
          if (sieve(value)) {
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
