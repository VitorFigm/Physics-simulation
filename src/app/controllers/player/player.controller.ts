import { animateView } from "./../animation/animation.controller";
import { Controller, GraphicalAPI, State, View } from "@app/models";
import { Observable } from "@app/utils";
import {
  inject,
  provide,
} from "app/core/inversion-of-control/inversion-of-control.engine";
import { CollisionService } from "app/services/colision/colision.service";
import { FightService } from "app/services/fight/fight.service";
import { AnimationControl } from "../animation/animation.controller";
import { avoidStuckedFighter } from "../avoid-stucked-fighter/avoid-stucked-fighter.controller";
import { Attacking } from "../states/attack/attacking.state";
import { Jumping } from "../states/jump/jumping.state";
import { Moving } from "../states/move/moving.state";
import { Stading } from "../states/standing.state";
import { StateHandler } from "../states/state-handler";
import { KeyboardControl } from "./keyboard-control/keyboard-control";
import { RenderizationAPI } from "app/core/engines/graphics/graphical-api";
import { ValidImageName } from "assets";

export const controlPlayer: Controller = (player) => {
  const movingAcceleration = 3;
  const maxVelocity = 4;
  const damage = 10;
  const jumpingDuration = 0.7;
  const attackigDuration = 1;

  let colision$: Observable<View>;
  let fightService: FightService;
  let keyboardControl: KeyboardControl;
  let setState: StateHandler["setState"];
  const stading = inject(Stading);
  let walking: Moving;
  let jumping: Jumping;
  let attacking: Attacking;
  let renderer: RenderizationAPI;
  let animationControl: AnimationControl;

  setDependencies();
  createStates();
  setAnimations();
  mapKeyboard();
  observeCollision();

  function setDependencies() {
    colision$ = inject(CollisionService).observeCollision(player);
    fightService = inject(FightService);
    fightService.registerFighter(player);

    keyboardControl = inject(KeyboardControl, {
      view: player,
    });
    const stateHandler = inject(StateHandler, { defaultState: stading });
    setState = stateHandler.setState.bind(stateHandler);
    renderer = inject(RenderizationAPI);
    animationControl = animateView(player) as AnimationControl;
  }

  function createStates() {
    walking = inject(Moving, {
      axis: "x",
      maxVelocity,
      initialAcceleration:0,
    });

    
    setDefaultStateEnd(walking);

    jumping = inject(Jumping, { duration: jumpingDuration });
    setJumpStateEnd(jumping);

    attacking = inject(Attacking, { duration: attackigDuration });
    setAttackStateEnd(attacking);
  }

  function setDefaultStateEnd(state: State) {
    state.watchStateEnd().subscribe({
      next: () => {
        setState(player, stading);
        stading.startState();
      },
    });
  }

  function setJumpStateEnd(jumping: Jumping) {
    jumping.watchStateEnd().subscribe({
      next: () => {
        const velocity = jumping.getJumpingXVelocity();
        setState(player, walking.setVelocity(velocity));
        walking.startState();
      },
    });
  }

  function setAttackStateEnd(attacking: Attacking) {
    attacking.watchStateEnd().subscribe({
      next: () => {
        const velocity = attacking.getVelocity()
        setState(player, walking.setVelocity(velocity));
        walking.startState();
      },
    });
  }

  function setAnimations() {
    setAnimationWatcher(stading, "char_idle", 0.5);
    stading.startState()
    setAnimationWatcher(walking, "char_run", 0.5);
    setAnimationWatcher(jumping, "char_jump", jumpingDuration);
    setAnimationWatcher(attacking, "char_attack", attackigDuration);
  }

  function setAnimationWatcher(
    state: State,
    assetName: ValidImageName,
    duration: number
  ) {
    state.watchStateStart().subscribe({
      next: () => {
        const direction = player.direction;
        const standingSprite = renderer.imageLoader.get(assetName);
        animationControl.next(standingSprite, duration, direction === "right");
      },
    });
  }

  function mapKeyboard() {
    const keyDownMapper = {
      d: () => walking.setAcceleration(movingAcceleration),
      a: () => walking.setAcceleration(-movingAcceleration),
      w: () => jumping,
      j: () => attacking,
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
      next: () => {},
    });
  }
};
