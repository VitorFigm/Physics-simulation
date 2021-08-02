import { State, View } from "@app/models";
import { BehaviorSubject, Subject } from "@app/utils";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { Moving } from "../move/moving.state";

type AttackingProps = {
  velocity: number;
};
export class Attacking extends State {
  canDealDamage = false;

  private _attackDuration: number;
  private _movingX: Moving;
  private _friction: number = 0.05;
  private _timeCounter: number = 0;
  private attackEnded = new Subject<boolean>();

  constructor(private _props: AttackingProps) {
    super();

    this._movingX = inject(Moving, {
      axis: "x",
      initialAcceleration: 0,
      friction: this._friction,
    });
  }

  onChange(_: State) {
    if (this._timeCounter != 0) {
      return "block";
    }
  }

  observeAttackEnd() {
    return this.attackEnded.toObservable();
  }

  attack(chargeDuration: number, attackDuration: number) {
    this.canDealDamage = false;
    this._movingX.velocity = this._props.velocity;
    this._timeCounter = chargeDuration + attackDuration;

    this._attackDuration = attackDuration;
    return this;
  }

  isAttacking(): this is Attacking {
    return true;
  }

  allowDamage() {
    this.canDealDamage = true;
  }

  construct(view: View) {
    if (this._timeCounter == 1) {
      this.attackEnded.next(true);
    }

    if (this._timeCounter === this._attackDuration) {
      this.allowDamage();
    }

    if (this._timeCounter != 0) {
      this._timeCounter--;
      this._movingX.construct(view);
    }
  }
}
