import { Provider } from "@app/models";
import { ControllingArm } from "../arm/states/controlling/controlling-arm";
import { Falling } from "../arm/states/falling/falling.state";
import { ThrowingBall } from "../arm/states/throwing-ball/throwing-ball";
import { Jumping } from "./jumping/jumping.state";
import { Moving } from "./moving/moving.state";

import { Standing } from "./stading.state";
import { ActionEmitter, FiniteStateMachine } from "./state-machine";

export const stateProviders = createUniqueStatesProviders();

function createUniqueStatesProviders() {
  const stateProviders: Provider[] = [
    FiniteStateMachine,
    ActionEmitter,
    Standing,
    Moving,
    Falling,
    ControllingArm,
    Jumping,
    ThrowingBall,
  ];

  return stateProviders.map((provide) => ({
    provide,
    useClass: provide,
    multiplesInstances: true,
  })) as Provider[];
}
