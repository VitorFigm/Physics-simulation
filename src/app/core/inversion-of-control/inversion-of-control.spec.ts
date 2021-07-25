import { Provider } from "@app/models";
import { inject, provide } from "./inversion-of-control.engine";

describe("Inversion of control", () => {
  class Token {}
  class Dependecy extends Token {}

  it("Should provide dependency", () => {
    provideDependency();
    expect(inject(Token)).toBeInstanceOf(Dependecy);
  });

  it("Should not provide dependencies without providers", () => {
    class TokenWithoutProviders {}
    expect(() => inject(TokenWithoutProviders)).toThrowError();
  });

  it("Should create singletons", () => {
    provideDependency();

    const instance1 = inject(Token);
    const instance2 = inject(Token);

    expect(instance1).toBe(instance2);
  });

  function provideDependency() {
    const providers: Provider[] = [{ provide: Token, useClass: Token }];
    provide(providers);
  }
});
