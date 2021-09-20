import { View } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import {
  LEFT_DIRECTION,
  RIGHT_DIRECTION,
} from "app/services/next-frame/constants";
import { State } from "../model/state.model";
import { Moving } from "../moving/moving.state";
import { FiniteStateMachine } from "../state-machine";

const GRAVITY = 1.6;

interface JumpingProps {
  stateMachine: FiniteStateMachine;
  initialVelocity?: number;
}

const DEFAULT_PROPS = {
  initialVelocity: 30,
};

export class Jumping extends State {
  name = "jumping";
  movingY: Moving;
  movingX: Moving;

  constructor(private _props: JumpingProps) {
    super(_props.stateMachine);

    this._props = { ...this._props, ...DEFAULT_PROPS };

    this.movingX = inject(Moving, {
      stateMachine: _props.stateMachine,
      axis: "x",
      initialAcceleration: 1,
    });

    this.movingY = inject(Moving, {
      stateMachine: this._props.stateMachine,
      axis: "y",
      initialAcceleration: -GRAVITY,
      friction: 0.001,
    });
  }

  listenActions() {
    this.setTransition({
      on: "jump",
      from: "moving",
      do: (walking: Moving) => {
        this.movingX.velocity = walking.velocity;
      },
    });
  }

  onInit(data: unknown): void {
    this.movingY.velocity = this._props.initialVelocity ?? 0;

    this.on("goLeft", () => {
      this.movingX.accelerate(LEFT_DIRECTION);
    });

    this.on("goRight", () => {
      this.movingX.accelerate(RIGHT_DIRECTION);
    });
  }

  execute(view: View): void {
    this.movingX.execute(view);

    this.movingY.accelerate();
    this.movingY.execute(view);

    if (view.position.absolute && view.position.absolute?.y < 0) {
      view.position.y = 0;
      view.position.absolute.y = 0;
      this._props.stateMachine.emit("endJump");
    }
  }
}
