import { ArmAction, ArmStateName, Point, View } from "@app/models";
import { State } from "app/controllers/states/model/state.model";
import {
  Moving,
  MovingProps,
} from "app/controllers/states/moving/moving.state";
import { FiniteStateMachine } from "app/controllers/states/state-machine";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import {
  calculateDistance,
  calculateRelativeCoordinate,
} from "app/utils/math/geometry/points";
import { FullArm } from "../../arm.controller";
import { Falling } from "../falling/falling.state";

interface ControllingArmProps {
  stateMachine: FiniteStateMachine<ArmAction>;
  arm: FullArm;
}

type MousePayload = { mousePosition?: Point };

export class ControllingArm extends State<ArmAction, ArmStateName> {
  name: ArmStateName = "controlling";

  private _movingFullArm: Moving;
  private _movingForeArm: Moving;

  private _armLength: number;

  private _armAngle?: number;
  private _foreArmAngle?: number;
  private _mousePosition?: Point;

  constructor(private _props: ControllingArmProps) {
    super(_props.stateMachine);
    this._armLength = this._props.arm.box.height;

    const movingConfig: MovingProps = {
      stateMachine: this._props.stateMachine,
      axis: "angle",
    };

    this._movingFullArm = inject(Moving, movingConfig);
    this._movingForeArm = inject(Moving, movingConfig);
  }

  listenActions() {
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

      this._foreArmAngle = this._calculateForeArmAngle(this._props.arm);
      this._armAngle = this._calculateArmAngle(
        this._props.arm,
        this._foreArmAngle as number
      );
    });
  }

  execute(arm: FullArm): void {
    const currentArmAngle = this._props.arm.position.angle;
    const currentForeArmAngle =
      this._props.arm.components.foreArm.position.angle;

    this._movingFullArm.velocity =
      this.getControlVelocity(currentArmAngle, this._armAngle as number) || 0;

    const shoudlAccelerate = true;
    this._movingFullArm.execute(arm);

    this._movingForeArm.velocity =
      this.getControlVelocity(
        currentForeArmAngle,
        this._foreArmAngle as number
      ) || 0;

    this._movingForeArm.execute(arm.components.foreArm, shoudlAccelerate);
  }

  /**
   * To make the angle converge to the derired angle over time, this function
   * do a optmization like the gradient decent algorithm of neural
   * networks but reversed. It will, overtime,
   * make the distance betwwen the current and the desired angle
   * converge to 0. Cos(0º) is the max point of cossine function, so if
   * we make the angle walk in the direction of the derivative
   * of cos(error), which is -sin(error),the error will converge to 0.
   */
  getControlVelocity(currentAngle: number, desiredAngle: number) {
    const rate = 0.3;

    return rate * -Math.sin(currentAngle - desiredAngle);
  }

  private _calculateForeArmAngle(arm: FullArm) {
    if (!arm.position.absolute || !this._mousePosition) {
      return;
    }

    let pointerDistance = calculateDistance(
      this._mousePosition,
      arm.position.absolute
    );

    if (pointerDistance >= this._armLength) {
      // this will make the arm point to a direction if it cant reach it
      pointerDistance = this._armLength;
    }

    return 2 * Math.acos(-pointerDistance / this._armLength);
  }

  private _calculateArmAngle(arm: FullArm, foreArmAngle: number) {
    const abssolutePosition = arm.position.absolute as Point;
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
