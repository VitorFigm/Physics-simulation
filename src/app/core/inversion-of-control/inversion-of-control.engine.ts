type Contructor = new () => unknown;
type Container = Map<
  Contructor,
  { instace?: unknown; Class: Contructor; singleton: boolean }
>;

type InjectionOptions = {
  token: Contructor;
  singleton?: boolean;
};

export abstract class InversionOfControl {
  static container: Container = new Map();

  /**
   * Decorator to provide class with a injection token in InversionOfControl.inject
   */

  static Injectable(options: InjectionOptions) {
    return (injection: Contructor) => {
      InversionOfControl.container.set(options.token, {
        Class: injection,
        singleton: Boolean(options.singleton),
      });
    };
  }

  static Inject(token: Contructor) {
    if (!InversionOfControl.container.has(token)) {
      throw new Error(`No provider for token: ${token.name}
              Tip: Use Injectable decorator at this dependency's implementation
              `);
    }
    return getInjectableInstance(token);
  }
}

const getInjectableInstance = (token: Contructor) => {
  const injection = InversionOfControl.container.get(token);
  const isNewInstaceNeeded = !injection.singleton || !injection.instace;

  if (isNewInstaceNeeded) {
    injection.instace = new injection.Class();
  }

  return injection.instace;
};
