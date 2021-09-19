import { Triangle } from "./triangle";

describe("Triangle", () => {
  it("should calculate the area of a right triangle correctly", () => {
    const triangleBase = 1;
    const triangleHeight = 1;

    const triangle = RightTriangle(triangleBase, triangleHeight);

    expect(triangle.getArea()).toBeCloseTo((triangleBase * triangleHeight) / 2);
  });

  it("should correctly check if a point is inside the triangle", () => {
    const triangleBase = 1;
    const triangleHeight = 1;

    const point = { x: 0.5, y: 0.5 };

    const triangle = RightTriangle(triangleBase, triangleHeight);

    expect(triangle.contains(point)).toBeTruthy();
  });

  it("should not consider a outside point as a inside point", () => {
    const triangleBase = 1;
    const triangleHeight = 1;

    const point = { x: 1.5, y: 1.5 };

    const triangle = RightTriangle(triangleBase, triangleHeight);

    expect(triangle.contains(point)).toBeFalsy();
  });

  it("should detect points on the edges", () => {
    const triangleBase = 1;
    const triangleHeight = 1;

    const point = { x: 1, y: 1 };

    const triangle = RightTriangle(triangleBase, triangleHeight);

    expect(triangle.contains(point)).toBeTruthy();
  });

  function RightTriangle(base: number, height: number) {
    return new Triangle([
      { x: 0, y: 0 },
      { x: base, y: 0 },
      { x: base, y: height },
    ]);
  }
});
