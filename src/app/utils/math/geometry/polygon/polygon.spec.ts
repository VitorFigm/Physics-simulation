import { Point } from "@app/models";
import { Polygon } from "./polygon";

describe("Polygon", () => {
  it("should detect intersection correctly between two rectangle", () => {
    const width = 2;
    const height = 3;

    const origin1 = { x: 0, y: 0 };
    const quadrilateral1 = Rectangle(origin1, width, height);

    const origin2 = { x: 0.5, y: 0.5 };
    const quadrilateral2 = Rectangle(origin2, width, height);

    expect(quadrilateral1.intersects(quadrilateral2)).toBeTruthy();
  });

  it("should not consider not overlapping rectangles as overlapping", () => {
    const width = 2;
    const height = 3;

    const origin1 = { x: 0, y: 0 };
    const quadrilateral1 = Rectangle(origin1, width, height);

    const origin2 = { x: 0.5, y: 0.5 };
    const quadrilateral2 = Rectangle(origin2, width, height);

    expect(quadrilateral1.intersects(quadrilateral2)).toBeTruthy();
  });

  function Rectangle(origin: Point, width: number, height: number) {
    const points = [
      origin,
      { x: origin.x + width, y: origin.y },
      { x: origin.x + width, y: origin.y + height },
      { x: origin.x, y: origin.y + height },
    ];

    return new Polygon(points);
  }
});
