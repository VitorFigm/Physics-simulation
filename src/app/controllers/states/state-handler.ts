import { ControledView, State } from "@app/models";

export class StateHandler {
  setState(view: ControledView, newState: State) {
    const blockChange = view.state.onChange(newState, view);

    if (!blockChange) {
      newState.onInit(view.state, view);

      view.state = newState;
    }
  }
}

/**
 * Use this to compose state and implements watch function
 */
