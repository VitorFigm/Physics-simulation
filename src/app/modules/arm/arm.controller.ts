import { Point, View } from "app/types";
import { Observable } from "@app/utils";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { CollisionService } from "app/services/collision/collision.service";
import { MouseService } from "app/services/mouse/mouse.service";
import {
  ActionEmitter,
  FiniteStateMachine,
} from "../global/states/state-machine";
import { ControllingArm } from "./states/controlling/controlling-arm";
import { Falling } from "./states/falling/falling.state";
import { ThrowingBall } from "./states/throwing-ball/throwing-ball";

export interface FullArm extends View {
  components: {
    arm: View;
    foreArm: ForeArm;
  };
}

export interface ForeArm extends View {
  components: {
    hand: View;
  };
}

type Controls = {
  controlArm$: Observable<Point>;
  looseArm$: Observable<boolean>;
};

export const controlArm = (arm: FullArm, controls: Controls) => {
  const { hand } = arm.components.foreArm.components;
  let stateMachine: FiniteStateMachine;
  let mouseService: MouseService;

  onInit();
  declareStates();
  controlArm();
  listenBallCatch();

  function onInit() {
    mouseService = inject(MouseService);
    inject(CollisionService).observeCollision(hand);

    stateMachine = inject(FiniteStateMachine);
    hand.actionEmitter = inject(ActionEmitter);
  }

  function declareStates() {
    const armLength = arm.box.height;

    arm.actionEmitter = stateMachine;

    const initialState = inject(Falling, {
      stateMachine,
      armLength,
    });
    initialState.listenActions();

    stateMachine.setState(initialState);

    inject(ControllingArm, { stateMachine, arm }).listenActions();
    inject(ThrowingBall, { stateMachine, arm }).listenActions();
  }

  function controlArm() {
    controls.controlArm$.subscribe({
      next: (mousePosition) => {
        stateMachine.emit("control", { desiredPosition: mousePosition });
      },
    });

    controls.looseArm$.subscribe({
      next: () => {
        stateMachine.emit("loose");
      },
    });
  }

  function listenBallCatch() {
    hand.actionEmitter?.action$
      .filter((emission) => {
        return emission.action === "catchBall";
      })
      .subscribe({
        next: (emission) => {
          stateMachine.emit("catchBall", emission.data);
        },
      });
  }
};
