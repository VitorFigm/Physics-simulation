import { Moving } from "./moving.state";
import { ControledView, View } from "@app/models";

describe("move", () => {
  it("should make a view move with contant velocity", () => {
    const velocity = 1;

    const moving = new Moving({
      axis: "x",
      initialAcceleration: 0,
      initialVelocity: velocity,
    });

    const mockView: Partial<ControledView> = {
      position: { x: 0, y: 0 },
      state: moving,
    };

    mockView.state = moving;

    const passes = 10;

    for (let iteration = 0; iteration < passes; iteration++) {
      mockView.state.construct(mockView as View);
    }
    expect(mockView.position.x).toEqual(passes * velocity);
  });
});
