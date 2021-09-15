import { View } from "@app/models";
import { BehaviorSubject, Subject } from "@app/utils";

type FighterStatus = BehaviorSubject<{
  life: number;
}>;

export class FightService {
  private _fightersMap: Map<View, FighterStatus> = new Map();

  constructor() {}

  registerFighter(fighterView: View) {
    const subject$ = new BehaviorSubject({ life: 100 });
    this._fightersMap.set(fighterView, subject$);
  }

  watchStatusChange(fighterView: View) {
    return this._fightersMap.get(fighterView)?.toObservable();
  }

  getFighterStatus(fighterView: View) {
    return this._fightersMap.get(fighterView)?.value;
  }

  dealDamageInFighter(fighterView: View, damage: number) {
    const fighterSubject$ = this._fightersMap.get(fighterView);

    if (!fighterSubject$) {
      return;
    }

    const newLife = fighterSubject$.value.life - damage;
    fighterSubject$.next({ life: newLife });
  }

  observeFighterDeath(fighterView: View) {
    return this.watchStatusChange(fighterView)?.filter(
      (value) => value.life === 0
    );
  }
}
