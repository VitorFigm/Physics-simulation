import { Attacking } from "app/controllers/states/attack/attacking.state";
import { Jumping } from "app/controllers/states/jump/jumping.state";
import { Moving } from "app/controllers/states/move/moving.state";
import { Stading } from "app/controllers/states/standing.state";
import { StateHandler } from "app/controllers/states/state-handler";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { ControledView, ImageLoader, View } from "./types";


export abstract class State {
  constructor(){
  };

  isMoving(): this is Moving {
    return false;
  }

  isJumping(): this is Jumping {
    return false;
  }

  isStanding(): this is Stading {
    return false;
  }

  isAttacking(): this is Attacking {
    return false;
  }

  onInit(previousState: State, view: View) {}

  onChange(nextState: State, view: View): string | boolean | void {}

  abstract construct(view: View): void;
}

export class GraphicalAPI {
  imageLoader: ImageLoader;
  graphics: CanvasRenderingContext2D;
}
