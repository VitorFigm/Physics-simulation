import { FighterAction, FighterStateName, View } from "@app/models";
import { State } from "./model/state.model";
import { FiniteStateMachine } from "./state-machine";

interface StadingProps {
  stateMachine: FiniteStateMachine;
}

export class Standing extends State<FighterAction, FighterStateName> {
  name: FighterStateName = "standing";
  constructor(props: StadingProps) {
    super(props.stateMachine);
  }
  onInit() {}
  execute(view: View) {}
}
