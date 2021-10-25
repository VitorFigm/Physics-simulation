import { View } from "app/types";
import { State } from "./entity/state.model";
import { FiniteStateMachine } from "./state-machine";

interface StadingProps {
  stateMachine: FiniteStateMachine;
}

export class Standing extends State {
  name = "standing";
  constructor(props: StadingProps) {
    super(props.stateMachine);
  }
  onInit() {}
  listenActions() {}
  execute(view: View) {}
}
