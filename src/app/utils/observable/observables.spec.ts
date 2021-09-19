import { Observable, of, Subject } from "./observables";

describe("Observable", () => {
  const valueToEmmit = 1;
  const observable$ = new Observable<number>(({ next }) => next(valueToEmmit));
  describe("subscribe", () => {
    it("should emmit the correct value", () => {
      observable$.subscribe({
        next(value) {
          expect(value).toEqual(valueToEmmit);
        },
      });
    });
  });

  describe("map", () => {
    it("should map sucessfully", () => {
      const valueToMap = 0;

      const maped$ = observable$.map((value) => valueToMap);

      maped$.subscribe({
        next(value) {
          expect(value).toEqual(valueToMap);
        },
      });
    });
  });

  describe("mergeMap", () => {
    it("should flat high order observables", () => {
      const valueToMap = 0;

      const maped$ = observable$.mergeMap((value) => of(valueToMap));

      maped$.subscribe({
        next(value) {
          expect(value).toEqual(valueToMap);
        },
      });
    });
  });
});

describe("Subject", () => {
  const subject = new Subject<number>();
  it("should emit values", (end) => {
    const valueToEmit = 1;
    subject.toObservable().subscribe({
      next(value) {
        expect(value).toEqual(value);
        end();
      },
    });

    subject.next(valueToEmit);
  });
});
