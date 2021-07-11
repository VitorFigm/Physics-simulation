import { State } from "../state-handler";

type InternalState = {
  velocity?: number;
  accelaration?: number;
};

type Params = {
  accelaration: number;
  axis: "x" | `y`;
  friction: number;
  initialVelocity?: number;
  maxVelocity?: number;
};

export const move = ({
  accelaration,
  axis,
  friction,
  initialVelocity,
  maxVelocity,
}: Params): State<InternalState> => {
  let internalState: InternalState = {
    velocity: initialVelocity ?? 0,
    accelaration,
  };

  return {
    is(stateName) {
      return stateName === "move";
    },

    construct(view) {
      const isVelocityMax =
        maxVelocity &&
        Math.abs(internalState.velocity) >= Math.abs(maxVelocity);

      const isOposityAcceleration =
        internalState.velocity / internalState.accelaration < 0;

      if (!isVelocityMax || isOposityAcceleration) {
        internalState.velocity += internalState.accelaration;
      }

      internalState.velocity *= 1 - friction;
      view.position[axis] += internalState.velocity;
    },
    transform(newInternalState) {
      Object.assign(internalState, newInternalState);
      return this;
    },
    getInternalState() {
      return internalState;
    },
  };
};
