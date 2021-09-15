import { ArmAction, ArmStateName, Point, View } from "@app/models";
import { Observable } from "@app/utils";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { MouseService } from "app/services/mouse/mouse.service";
import { FiniteStateMachine } from "../states/state-machine";
import { ControllingArm } from "./states/controlling/controlling-arm";
import { Falling } from "./states/falling/falling.state";

export interface FullArm extends View {
  components: {
    arm: View;
    forearm: View;
  };
}

export const controlArm = (
  arm: FullArm,
  controlArm$: Observable<Point>,
  looseArm$: Observable<boolean>
) => {
  let stateMachine: FiniteStateMachine<ArmAction>;
  let mouseService: MouseService;
  onInit();
  controlArm();

  function onInit() {
    const armLength = arm.box.height;

    stateMachine = inject(FiniteStateMachine);
    arm.stateMachine = stateMachine;

    const initialState = inject(Falling, {
      stateMachine,
      armLength,
    });
    stateMachine.setState(initialState);

    inject(ControllingArm, { stateMachine, armLength });

    mouseService = inject(MouseService);
  }

  function controlArm() {
    controlArm$.subscribe({
      next: (mousePosition) => {
        stateMachine.emit("control", { mousePosition });
      },
    });

    looseArm$.subscribe({
      next: () => {
        stateMachine.emit("loose");
      },
    });
  }
};
