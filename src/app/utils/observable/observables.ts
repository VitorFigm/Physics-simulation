import { Subscriber, Subscription } from "@app/models";

type Mapper<T, R> = (value: T) => R;

type Tapper<T> = (value: T) => void;

type Sieve<T> = (value: T) => boolean;

type Callback<T> = (subscriber: Subscriber<T>) => void;

export type UnsubscribeCallback = (subscriber: Subscriber<unknown>) => void;

/**
 * Those implementation is based in rxjs Observable implementation.
 * I'm create it myself for the sake of the challenge. Most of the implementation behave this same
 * way rxjs objects/methods/operators with same name does, so worth give a check if it something that confuses you:
 * https://rxjs.dev/
 */

export class Observable<T> {
  constructor(
    private _subscriberCallback: Callback<T>,
    private _unsubscribeCallback?: UnsubscribeCallback
  ) {}

  subscribe(subscriber: Subscriber<T>): Subscription {
    this._subscriberCallback(subscriber);

    return {
      unsubscribe: () => {
        this._unsubscribeCallback?.(subscriber);
      },
    };
  }

  /**
   * Transform the value emited from a observable
   */
  map<R>(mapper: Mapper<T, R>) {
    let subscriberMapper: Subscriber<T>;
    return new Observable<R>(
      (subscriber) => {
        subscriberMapper = {
          next(value: T) {
            subscriber.next(mapper(value));
          },
          error(error) {
            subscriber.error(error);
          },
        };

        this.subscribe(subscriberMapper);
      },
      () => this._unsubscribeCallback(subscriberMapper)
    );
  }

  /**
   * Prevent observable to emit values that do follow
   * some criteria from a sieve function
   */

  filter(callback: Sieve<T>) {
    let subscriberSieve: Subscriber<T>;
    return new Observable<T>(
      (subscriber) => {
        subscriberSieve = {
          next(value: T) {
            if (callback(value)) {
              subscriber.next(value);
            }
          },
          error(error) {
            subscriber.error(error);
          },
        };

        this.subscribe(subscriberSieve);
      },
      () => {
        this._unsubscribeCallback(subscriberSieve);
      }
    );
  }

  /**
   * Listen emitted of Observable value but doesn't change it
   */

  tap(tapper: Tapper<T>) {
    return this.map((value) => {
      tapper(value);
      return value;
    });
  }

  /**
   * Flatten high order observable.
   * When we have a observable that emits another observable, will concat two of thoses into
   * one single observable.
   *
   */
  concatMap<R>(concatMapper: Mapper<T, Observable<R>>) {
    let subscriberMapper: Subscriber<T>;
    return new Observable<R>((subscriber) => {
      subscriberMapper = {
        next(value: T) {
          concatMapper(value).subscribe(subscriber);
        },
        error(error) {
          subscriber.error(error);
        },
      };

      this.subscribe(subscriberMapper);
    }, this._unsubscribeCallback);
  }
}

export class Subject<T> {
  value: T;

  private _subscribers: Subscriber<T>[] = [];

  next(value: T) {
    this.value = value;
    this._subscribers.forEach((subscriber) => {
      subscriber.next(value);
    });
  }

  toObservable = () => {
    return new Observable<T>(
      (subscriber) => {
        this._subscribers.push(subscriber);
      },
      (toUnsubscribe) => {
        this._subscribers = this._subscribers.filter((subscriber) => {
          return subscriber != toUnsubscribe;
        });
      }
    );
  };
}

export class BehaviorSubject<T> extends Subject<T> {
  constructor(private _initialValue: T) {
    super();
    this.value = this._initialValue;
    this.next(this.value);
  }
}

export const of = <T>(...values: T[]) => {
  return new Observable<T>(({ next }) => {
    values.forEach(next);
  });
};
