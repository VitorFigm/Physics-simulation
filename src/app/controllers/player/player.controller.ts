import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { KeyboardService } from "./../../services/keyboard/keyboard.service";
import { FiniteStateMachine } from "./../states/state-machine";
import { View } from "@app/models";
import { Standing } from "../states/stading.state";
import { Moving } from "../states/moving/moving.state";

export const controlPlayer = (view: View) => {
  let stateMachine: FiniteStateMachine;
  let keyboardService: KeyboardService;
  onInit();
  defineKeyActions();

  function onInit() {
    stateMachine = inject(FiniteStateMachine);
    view.stateMachine = stateMachine;
    const initialState = inject(Standing, { stateMachine });
    stateMachine.setState(initialState);
    inject(Moving, { stateMachine, acceleration: 1, axis: "x" });

    keyboardService = inject(KeyboardService);
  }

  function defineKeyActions() {
    keyboardService.listenKeyPress("a").subscribe({
      next: () => {
        stateMachine.emit("goLeft");
      },
    });

    keyboardService.listenKeyPress("d").subscribe({
      next: () => {
        stateMachine.emit("goRight");
      },
    });
  }
};
