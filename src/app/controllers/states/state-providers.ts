import { Provider } from "@app/models";
import { ControllingArm } from "../arm/states/controlling/controlling-arm";
import { Falling } from "../arm/states/falling/falling.state";
import { Jumping } from "./jumping/jumping.state";
import { Moving } from "./moving/moving.state";

import { Standing } from "./stading.state";
import { FiniteStateMachine } from "./state-machine";

export const stateProviders = createUniqueStatesProviders();

function createUniqueStatesProviders() {
  const stateProviders: Provider[] = [
    FiniteStateMachine,
    Standing,
    Moving,
    Falling,
    ControllingArm,
    Jumping,
  ];

  return stateProviders.map((provide) => ({
    provide,
    useClass: provide,
    injectMultiples: true,
  })) as Provider[];
}
