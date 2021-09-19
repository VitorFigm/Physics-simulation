import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { KeyboardService } from "./../../services/keyboard/keyboard.service";
import { FiniteStateMachine } from "./../states/state-machine";
import { FighterAction, Point, View } from "@app/models";
import { Standing } from "../states/stading.state";
import { Moving } from "../states/moving/moving.state";
import { controlArm, FullArm } from "../arm/arm.controller";
import { MouseService } from "app/services/mouse/mouse.service";
import { Jumping } from "../states/jumping/jumping.state";
import { Observable } from "@app/utils";
import { CollisionService } from "app/services/colision/colision.service";

export interface Player extends View {
  components: {
    fullArm: FullArm;
  };
}

export const controlPlayer = (player: Player) => {
  let stateMachine: FiniteStateMachine<FighterAction>;
  let keyboardService: KeyboardService;
  let mouseService = inject(MouseService);
  let collision$: Observable<View>;
  let mousePosition: Point = { x: 0, y: 0 };

  onInit();
  defineKeyActions();
  defineArmControl();
  observeMouseMove();
  handleColision();

  function onInit() {
    stateMachine = inject(FiniteStateMachine);
    collision$ = inject(CollisionService).observeCollision(player);

    player.stateMachine = stateMachine;
    const initialState = inject(Standing, { stateMachine });
    initialState.listenActions();
    stateMachine.setState(initialState);
    inject(Moving, {
      stateMachine,
      initialAcceleration: 1,
      axis: "x",
    }).listenActions();

    inject(Jumping, { stateMachine }).listenActions();

    keyboardService = inject(KeyboardService);
    mouseService = inject(MouseService);
  }

  function defineKeyActions() {
    keyboardService.listen("keypress", "left").subscribe({
      next: () => {
        stateMachine.emit("goLeft");
      },
    });

    keyboardService.listen("keypress", "right").subscribe({
      next: () => {
        stateMachine.emit("goRight");
      },
    });

    keyboardService.listen("keydown", "up").subscribe({
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
    const controlArm$ = mouseService.observeMouseHold().map(() => {
      return mousePosition;
    });

    const looseArm$ = mouseService.observeMouseUp().map(Boolean);

    const controls = { controlArm$, looseArm$ };

    controlArm(player.components.fullArm, controls);
  }

  function handleColision() {
    collision$.subscribe({
      next: () => {
        console.log("test");
      },
    });
  }
};
