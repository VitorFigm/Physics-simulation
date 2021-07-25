import { Stading } from "./standing.state";
import { Jumping } from "./jump/jumping.state";
import { Moving } from "./move/moving.state";
import { Provider } from "@app/models";
import { StateHandler } from "./state-handler";

const providers = [Stading, Jumping, Moving, StateHandler];

const createNotSingletonProvider = (provider: new () => any) => ({
  useClasse: provider,
  provide: provider,
  injectMultiples: true,
});

export const stateProviders = providers.map(createNotSingletonProvider);
