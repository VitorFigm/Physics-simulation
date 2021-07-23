import { State, View } from "@app/models";

export const mergeStates = (
  state1: State,
  state2: State,
  identifierFunctions: Record<string, () => boolean>
): State => {
  class MergedState extends State {
    construct: (view: View) => void;

    constructor() {
      super();

      this._setIdentifiers();

      this.construct = this._mergeConstruction();
    }

    private _mergeConstruction() {
      const construct1 = state1.construct.bind(state1);
      const construct2 = state2.construct.bind(state2);

      return (view: View) => {
        construct1(view);
        construct2(view);
      };
    }

    private _setIdentifiers() {
      Object.entries(identifierFunctions).forEach(([key, value]) => {
        this[key as keyof State] = value;
      });

      this.isMerge = () => true;
    }
  }

  return new MergedState();
};
