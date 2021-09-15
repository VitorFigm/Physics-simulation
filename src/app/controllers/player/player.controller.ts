import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { KeyboardService } from "./../../services/keyboard/keyboard.service";
import { FiniteStateMachine } from "./../states/state-machine";
import { FighterAction, Point, View } from "@app/models";
import { Standing } from "../states/stading.state";
import { Moving } from "../states/moving/moving.state";
import { controlArm, FullArm } from "../arm/arm.controler";
import { MouseService } from "app/services/mouse/mouse.service";
import { Jumping } from "../states/jumping/jumping.state";

export interface Player extends View {
  components: {
    fullArm: FullArm;
  };
}

export const controlPlayer = (view: Player) => {
  let stateMachine: FiniteStateMachine<FighterAction>;
  let keyboardService: KeyboardService;
  let mouseService = inject(MouseService);
  let mousePosition: Point = { x: 0, y: 0 };

  onInit();
  defineKeyActions();
  defineArmControl();
  observeMouseMove();

  function onInit() {
    stateMachine = inject(FiniteStateMachine);

    view.stateMachine = stateMachine;
    const initialState = inject(Standing, { stateMachine });
    stateMachine.setState(initialState);
    inject(Moving, { stateMachine, initialAcceleration: 1, axis: "x" });

    inject(Jumping, { stateMachine });

    keyboardService = inject(KeyboardService);
    mouseService = inject(MouseService);
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

    keyboardService.listenKeyPress("w").subscribe({
      next: () => {
        stateMachine.emit("jump");
      },
    });
  }

  function observeMouseMove() {
    mouseService.observeMouseMove().subscribe({
      next: (newMousePosition) => {
        mousePosition = newMousePosition;
      },
    });
  }

  function defineArmControl() {
    const controlArm$ = keyboardService.listenKeyPress("space").map((a) => {
      return mousePosition;
    });

    const looseArm$ = keyboardService.listenKeyUp("space");

    controlArm(view.components.fullArm, controlArm$, looseArm$);
  }
};
