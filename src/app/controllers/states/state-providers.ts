import { Provider } from "@app/models";
import { Moving } from "./moving/moving.state";

import { Standing } from "./stading.state";
import { FiniteStateMachine } from "./state-machine";

export const stateProviders = createUniqueStatesProviders();

function createUniqueStatesProviders() {
  const stateProviders: Provider[] = [FiniteStateMachine, Standing, Moving];

  return stateProviders.map((provide) => ({
    provide,
    useClass: provide,
    injectMultiples: true,
  })) as Provider[];
}
