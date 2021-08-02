import { ControledView, Controller, View } from "@app/models";
import { Observable } from "@app/utils";
import {
  inject,
  provide,
} from "app/core/inversion-of-control/inversion-of-control.engine";
import { ColisionService } from "app/services/colision/colision.service";
import { FightService } from "app/services/fight/fight.service";
import { avoidStuckedFighter } from "../avoid-stucked-fighter/avoid-stucked-fighter.controller";
import { Attacking } from "../states/attack/attacking.state";
import { Jumping } from "../states/jump/jumping.state";
import { Moving } from "../states/move/moving.state";
import { Stading } from "../states/standing.state";
import { StateHandler } from "../states/state-handler";
import { KeyboardControl } from "./keyboard-control/keyboard-control";

export const controlPlayer: Controller = (player) => {
  const initialAcceleration = 3;
  const maxVelocity = 4;
  const damage = 10;

  let colision$: Observable<View>;
  let fightService: FightService;
  let keyboardControl: KeyboardControl;
  let setState: StateHandler["setState"];
  let stading: Stading;
  let walking: Moving;
  let jumping: Jumping;
  let attacking: Attacking;

  setDependencies();
  createStates();
  mapKeyboard();
  observeCollision();

  function setDependencies() {
    colision$ = inject(ColisionService).observeCollision(player);
    fightService = inject(FightService);
    fightService.registerFighter(player);
    keyboardControl = inject(KeyboardControl, { view: player });
    setState = inject(StateHandler).setState;
  }

  function createStates() {
    stading = inject(Stading);
    walking = inject(Moving, {
      axis: "x",
      maxVelocity,
      initialAcceleration,
    });
    jumping = inject(Jumping, { maxDistance: 200 });
    attacking = inject(Attacking, { velocity: maxVelocity });
    attacking.observeAttackEnd().subscribe({
      next: () => {
        setState(player, stading);
      },
    });
  }

  function mapKeyboard() {
    const keyDownMapper = {
      d: () => walking.setAcceleration(initialAcceleration),
      a: () => walking.setAcceleration(-initialAcceleration),
      w: () => jumping,
      j: () => attacking.attack(30, 20),
    };

    const halt = () => walking.stop();
    const keyUpMapper = {
      d: halt,
      a: halt,
    };

    keyboardControl.mapKeyDownEvent(keyDownMapper);
    keyboardControl.mapKeyUpEvent(keyUpMapper);
  }

  function observeCollision() {
    colision$.subscribe({
      next: (enemy) => {
        if (
          player.state.isMoving() ||
          player.state.isJumping() ||
          player.state.isAttacking()
        ) {
          avoidStuckedFighter(player, enemy);
        }

        if (player.state.isAttacking() && player.state.canDealDamage) {
          fightService.dealDamageInFighter(enemy, damage);
        }
      },
    });
  }

  function reactToDamage() {
    fightService.watchStatusChange(player).subscribe({
      next: () => {
        
      },
    });
  }
};
