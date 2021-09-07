import { View, State } from "@app/models";
import { Stading } from "./standing.state";

export class StateHandler {
  constructor() {}
  setState(view: View, newState: State) {
    const blockChange = view.state.onChange(newState, view);

    if (blockChange) {
      return;
    }

    newState.onInit(view.state, view);
    view.state = newState;
  }
}

/**
 * Use this to compose state and implements watch function
 */
