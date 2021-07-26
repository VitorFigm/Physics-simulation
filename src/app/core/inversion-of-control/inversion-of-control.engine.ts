import { InjectableConstructor, Provider } from "@app/models";

type Container = Map<
  InjectableConstructor,
  { instance?: unknown; Class: InjectableConstructor; injectMultiples: boolean }
>;

class InversionOfControl {
  static container: Container = new Map();

  /**
   * Provide a class instace of the token parameter
   * Use this to make dependecy injection in functions or in classes
   */

  static inject<T, P>(token: InjectableConstructor<T, P>, props?: P): T {
    if (!InversionOfControl.container.has(token)) {
      throwNoProviderError(token.name);
    }

    return getInjectableInstance(token, props);
  }

  /**
   * For a class be injectable into other(be returned by the Inject static method), it need first be provided in
   * an array of providers with this method.
   */

  static provide(providers: Provider[]) {
    providers.forEach((provider: Provider) => {
      if (provider instanceof Function) {
        setInjectableClass(provider, provider, false);
        return;
      }

      if ("useValue" in provider) {
        const returnValue = () => provider.useValue;
        class Provider {
          constructor() {
            return returnValue();
          }
        }
        setInjectableClass(provider.provide, Provider, false);
        return;
      }

      const { provide, useClass } = provider;
      setInjectableClass(provide, useClass, provider.injectMultiples);
    });
  }
}

const throwNoProviderError = (tokenName: string) => {
  throw new Error(`No provider for token: ${tokenName}
                Tip: declare it in providers array, like this: 
                const providers = [ /* ...other providers */, ${tokenName}];
                provide(prodivers)

                Or like this, if ${tokenName} is an injection token:
                const providers = [ /* ...other providers */, {token:${tokenName}, useClass: Implementation}];
                provide(prodivers)
                `);
};

const getInjectableInstance = <T, P>(
  token: InjectableConstructor<T, P>,
  props?: P
) => {
  const injection = InversionOfControl.container.get(token);
  const isNotSingleton = injection.injectMultiples;

  if (isNotSingleton) {
    return getInstace(injection.Class, props) as T;
  }

  if (!injection.instance) {
    injection.instance = getInstace(injection.Class, props);
  }

  return injection.instance as T;
};

const getInstace = <T, P>(Class: InjectableConstructor<T, P>, props: P) => {
  return props ? new Class(props) : new Class();
};

const setInjectableClass = (
  token: InjectableConstructor,
  injection: InjectableConstructor,
  injectMultiples: boolean
) => {
  InversionOfControl.container.set(token, {
    Class: injection,
    injectMultiples,
  });
};

export const { inject, provide } = InversionOfControl;
