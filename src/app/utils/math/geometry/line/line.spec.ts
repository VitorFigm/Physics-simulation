import { LineSegment } from "./line";

describe("LineSegment", () => {
  it("should detect line intersection", () => {
    const point1 = { x: 0, y: 0 };

    const point2 = { x: 1, y: 1 };

    const point3 = { x: 0.5, y: 0 };
    const point4 = { x: 0, y: 1 };

    const line1 = LineSegment.fromPoints(point1, point2);
    const line2 = LineSegment.fromPoints(point3, point4);

    expect(line1.intersects(line2)).toBeTruthy();
  });

  it("should assume that parallel lines intersects", () => {
    const point1 = { x: 0, y: 0 };

    const point2 = { x: 1, y: 1 };

    const point3 = { x: 0.5, y: 0.5 };
    const point4 = { x: 1.5, y: 1.5 };

    const line1 = LineSegment.fromPoints(point1, point2);
    const line2 = LineSegment.fromPoints(point3, point4);

    expect(line1.intersects(line2)).toBeFalsy();
  });
});
