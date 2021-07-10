import { State } from "..";

type InternalState = {
  velocity: number;
  accelaration: number;
};

export const walk = (
  maxVelocity: number,
  accelaration: number,
  friction: number
): State => {
  let internalState: InternalState = {
    velocity: 0,
    accelaration,
  };

  return {
    is(stateName) {
      return stateName === "walk";
    },
    construct(view) {
      const isVelocityMax =
        Math.abs(internalState.velocity) >= Math.abs(maxVelocity);

      const isOposityAcceleration =
        internalState.velocity / internalState.accelaration < 0;

      if (!isVelocityMax || isOposityAcceleration) {
        internalState.velocity += internalState.accelaration;
      }

      internalState.velocity *= 1 - friction;
      view.position.x += internalState.velocity;
    },
    transform(newInternalState: InternalState) {
      Object.assign(internalState, newInternalState);
      return this;
    },
  };
};
