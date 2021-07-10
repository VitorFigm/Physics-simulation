import { Observable } from "./observables.model";

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
});
