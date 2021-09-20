import { Position, View } from "@app/models";
import { State } from "app/controllers/states/model/state.model";
import { Moving } from "app/controllers/states/moving/moving.state";
import { FiniteStateMachine } from "app/controllers/states/state-machine";
import { RenderizationAPI } from "app/core/engines/graphics/graphical-api";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { CollisionService } from "app/services/collision/collision.service";
import { GRAVITY } from "app/services/next-frame/constants";
import { NextFrameService } from "app/services/next-frame/next-frame.service";
import { ParticleService } from "app/services/particles/particles.service";
import { FullArm } from "../../arm.controller";
import { ControllingArm } from "../controlling/controlling-arm";

interface ThrowingBallProps {
  stateMachine: FiniteStateMachine;
  arm: FullArm;
  mass?: number;
}

const DEFAULT_PROPS = {
  mass: 1,
};

export class ThrowingBall extends State {
  name: string = "throwing";
  private _props: Required<ThrowingBallProps>;

  private _armLength: number;

  private _controllingArm: ControllingArm;
  private _particleService = inject(ParticleService);
  private _colisionService = inject(CollisionService);
  private _imageApi = inject(RenderizationAPI);

  private _hand: View;

  constructor(_props: ThrowingBallProps) {
    super(_props.stateMachine);
    this._props = { ..._props, ...DEFAULT_PROPS };

    this._controllingArm = inject(ControllingArm, {
      arm: this._props.arm,
      stateMachine: this._props.stateMachine,
    });

    this._armLength = this._props.arm.box.height;
    this._hand = this._props.arm.components.foreArm.components.hand;
  }

  listenActions(): void {
    this.setTransition({ from: "controlling", on: "catchBall" });
  }

  onInit({ ball }: { ball: View }) {
    this._hand.sprite = this._imageApi.imageLoader.get("red-box").image;

    this.on("loose", () => {
      // this._throwBall(ball);
      this._hand.sprite = this._imageApi.imageLoader.get("blue-box").image;
    });

    this._controllingArm.onInit();
  }

  execute(view: FullArm): void {
    this._controllingArm.execute(view);
  }

  private _throwBall(ball: View) {
    const ballController = this._renderBall(ball);
    // this._moveBall(ball);

    const subscription = this._colisionService
      .observeCollision(ball)
      .subscribe({
        next: (view) => {
          if (view != this._hand) {
            view.actionEmitter?.emit("attacked");
            ballController.removeParticle();
            subscription.unsubscribe();
          }
        },
      });
  }

  private _renderBall(ball: View) {
    const ballController = this._particleService.renderParticle(ball);
    ball.position = this._hand.position.absolute as Position;
    ball.position.absolute = ball.position;
    return ballController;
  }

  private _moveBall(ball: View) {
    const ballStateMachine = inject(FiniteStateMachine);
    const movingBall = new MovingBall(ballStateMachine);
    const ballVelocity = this._calculateBallVelocity();
    movingBall.movingBallX.velocity = ballVelocity.xVelocity;
    movingBall.movingBallY.velocity = ballVelocity.yVelocity;

    ballStateMachine.setState(movingBall);
  }

  private _calculateBallVelocity() {
    const { armVelocity, foreArmVelocity } =
      this._controllingArm.getAngularVelocities();

    const ballXVelocity =
      (this._armLength / 2) * Math.cos(armVelocity / 2) * armVelocity +
      Math.cos(foreArmVelocity / 2) * foreArmVelocity;

    const ballYVelocity =
      (this._armLength / 2) * Math.sin(armVelocity / 2) * armVelocity +
      Math.sin(foreArmVelocity / 2) * foreArmVelocity;

    return {
      xVelocity: ballXVelocity,
      yVelocity: ballYVelocity,
    };
  }
}

class MovingBall {
  movingBallY: Moving;
  movingBallX: Moving;

  constructor(ballStateMachine: FiniteStateMachine) {
    this.movingBallY = inject(Moving, {
      stateMachine: ballStateMachine,
      axis: "y",
      initialAcceleration: -GRAVITY,
    });

    this.movingBallX = inject(Moving, {
      stateMachine: ballStateMachine,
      axis: "x",
    });
  }

  execute(view: View): void {
    this.movingBallX.execute(view);
    this.movingBallY.execute(view);
  }
}
