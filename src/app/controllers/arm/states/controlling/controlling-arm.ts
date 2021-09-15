import { ArmAction, ArmStateName, Point, View } from "@app/models";
import { State } from "app/controllers/states/model/state.model";
import { FiniteStateMachine } from "app/controllers/states/state-machine";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { MouseService } from "app/services/mouse/mouse.service";
import {
  calculateDistance,
  calculateRelativeCoordinate,
} from "app/utils/math/geometry";
import { FullArm } from "../../arm.controler";
import { Falling } from "../falling/falling.state";

interface ControllingArmProps {
  stateMachine: FiniteStateMachine<ArmAction>;
  armLength: number;
}

type MousePayload = { mousePosition?: Point };

export class ControllingArm extends State<ArmAction, ArmStateName> {
  name: ArmStateName = "controlling";

  private _mousePosition?: Point;

  constructor(private _props: ControllingArmProps) {
    super(_props.stateMachine);

    this.setTransition({
      from: "falling",
      on: "control",
      do: (falling: Falling) => {
        falling.stop();
      },
    });
  }

  onInit(): void {
    this.on("control", (data?: MousePayload) => {
      this._mousePosition = data?.mousePosition;
    });
  }

  execute(view: FullArm): void {
    const foreArmAngle = this._calculateForeArmAngle(view);

    if (!foreArmAngle) {
      return;
    }

    view.components.forearm.position.angle = foreArmAngle;
    view.position.angle = this._calculateArmAngle(view, foreArmAngle);
  }

  private _calculateForeArmAngle(arm: FullArm) {
    if (!arm.position.absolute || !this._mousePosition) {
      return;
    }

    let pointerDistance = calculateDistance(
      this._mousePosition,
      arm.position.absolute
    );

    if (pointerDistance >= this._props.armLength) {
      // this will make the arm point to a direction if it cant reach it
      pointerDistance = this._props.armLength;
    }

    return 2 * Math.acos(-pointerDistance / this._props.armLength);
  }

  private _calculateArmAngle(view: View, foreArmAngle: number) {
    const abssolutePosition = view.position.absolute as Point;
    const mousePosition = this._mousePosition as Point;
    const delta = calculateRelativeCoordinate(mousePosition, abssolutePosition);

    // prevents angle equals 0, because it can make the atan blow to infinity
    delta.x = delta.x || 0.01;
    delta.y = delta.y || 0.01;

    const anglePositiveRegion =
      Math.PI + Math.atan(delta.x / delta.y) - foreArmAngle / 2;

    const angleTridQuadrant =
      -Math.PI / 2 - Math.atan(delta.y / delta.x) - foreArmAngle / 2;

    const angleForthQuadrant = +Math.atan(delta.x / delta.y) - foreArmAngle / 2;

    return delta.y > 0
      ? anglePositiveRegion
      : delta.x > 0
      ? angleTridQuadrant
      : angleForthQuadrant;
  }
}
