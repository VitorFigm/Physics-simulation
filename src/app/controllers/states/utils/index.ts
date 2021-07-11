import { State } from "../state-handler";

export const mergeStates = (state1: State, state2: State): State => {
  const firstState = { ...state1 };
  const secondState = { ...state2 };
  return {
    is(stateName) {
      return (
        firstState.is(stateName) ||
        secondState.is(stateName) ||
        stateName === "merge"
      );
    },
    construct(view) {
      firstState.construct(view);
      secondState.construct(view);
    },
  };
};
