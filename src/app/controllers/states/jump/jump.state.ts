import { Context, View } from "@app/types";
import { Inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { State, StateHandler } from "../state-handler";
import { mergeStates } from "../utils";

export const jump = (maxDistance: number) =>
  jumpImplementation(maxDistance, Inject as Context["Inject"]);

/**
 * Isolated implementaion of junp for unit test
 */
export const jumpImplementation = (
  maxDistance: number,
  Inject: Context["Inject"]
): State => {
  const GRAVITY = 0.1;
  const move = Inject(StateHandler).getStates().move;

  const initialVelocity = calculateInitialVelocity();

  let movingUp = move({
    initialVelocity,
    axis: "y",
    accelaration: -GRAVITY,
    friction: 0.005,
  });

  return {
    is(stateName) {
      return stateName === "jump";
    },
    construct(view: View) {
      movingUp.construct(view);
      if (view.position.y <= 0) {
        view.position.y = 0;
        movingUp = movingUp.transform({ velocity: 0, accelaration: 0 });
      }
    },
    onInit(_, previousState) {
      if (previousState.is("move")) {
        const jumpingAndMoving = mergeStates(this, previousState);

        Object.assign(this, jumpingAndMoving);
      }
    },
    onChange(view) {
      if (view.position.y > 0) {
        return "block";
      }
    },
  };

  function calculateInitialVelocity() {
    return Math.sqrt(2 * GRAVITY * maxDistance);
  }
};
