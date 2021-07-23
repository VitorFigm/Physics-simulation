import { Moving } from "./moving.state";
import { ControledView, View } from "@app/models";

describe("move", () => {
  it("should make a view move with contant velocity", () => {
    const moving = new Moving(0, "x", 0, 1);

    const mockView: Partial<ControledView> = {
      position: { x: 0, y: 0 },
      state: moving,
    };

    mockView.state = moving;

    for (let iteration = 0; iteration < 10; iteration++) {
      mockView.state.construct(mockView as View);
    }
    expect(mockView.position.x).toEqual(10);
  });
});
