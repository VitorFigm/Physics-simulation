import { Inject, Injectable } from "./inversion-of-control.engine";

describe("Inversion of control", () => {
  class Token {}

  it("Should provide dependency", () => {
    @Injectable({ token: Token })
    class Dependecy {}

    expect(Inject(Token)).toBeInstanceOf(Dependecy);
  });

  it("Should not provide dependencies without providers", () => {
    class TokenWithoutProviders {}
    expect(() => Inject(TokenWithoutProviders)).toThrowError();
  });

  it("Should create singleton", () => {
    @Injectable({ token: Token, singleton: true })
    class Dependecy {}

    const instance1 = Inject(Token);
    const instance2 = Inject(Token);

    expect(instance1).toBe(instance2);
  });
});
