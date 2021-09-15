import { Point } from "@app/models";

/**
 * rotate a point using the [rotation matrix](https://cadbooster.com/wp-content/uploads/2019/08/044-12-rotation-matrix-2D-1.png)
 */
export const rotatePoint = (point: Point, angle: number) => {
  return {
    x: point.x * Math.cos(angle) + point.y * Math.sin(angle),
    y: point.y * Math.cos(angle) - point.x * Math.sin(angle),
  };
};

/**
 * Distances between two points
 */
export const calculateDistance = (point1: Point, point2: Point) => {
  const deltaX = point1.x - point2.x;
  const deltaY = point1.y - point2.y;

  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
};

/**
 * Makes `relativeTo` the origin of a coordinate system and returns the coordinates of `point1` in this sistem
 */
export const calculateRelativeCoordinate = (
  point1: Point,
  relativeTo: Point
) => ({
  x: point1.x - relativeTo.x,
  y: point1.y - relativeTo.y,
});
