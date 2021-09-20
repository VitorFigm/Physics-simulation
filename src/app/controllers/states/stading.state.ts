import { View } from "@app/models";
import { State } from "./model/state.model";
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
