import { Stading } from "./standing.state";
import { Jumping } from "./jump/jumping.state";
import { Moving } from "./move/moving.state";
import { Provider } from "@app/models";
import { StateHandler } from "./state-handler";
import { Attacking } from "./attack/attacking.state";

const providers: Provider[] = [
  Stading,
  Jumping,
  Moving,
  StateHandler,
  Attacking,
];

const createNotSingletonProvider = (provider: Provider) =>
  ({
    provide: provider,

    useClass: provider,
    injectMultiples: true,
  } as Provider);

export const stateProviders = providers.map(createNotSingletonProvider);
