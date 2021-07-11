import { move } from "./moving.state";
import { View } from "@app/types";

describe("move", () => {
  it("should make a view move with contant velocity", () => {
    const moving = move({
      axis: "x",
      accelaration: 0,
      friction: 0,
      initialVelocity: 1,
    });

    const mockView = {
      position: { x: 0, y: 0 },
      state: moving,
    };

    mockView.state = moving;

    for (let iteration = 0; iteration < 10; iteration++) {
      mockView.state.construct(mockView as unknown as View);
    }
    expect(mockView.position.x).toEqual(10);
  });
});
