import { Point, Position, View } from "@app/models";

/**
 * rotate a point arroud the origin
 * using the [rotation matrix](https://cadbooster.com/wp-content/uploads/2019/08/044-12-rotation-matrix-2D-1.png)
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
 * given an array of points, returns a array all distance formed
 * by two consecutive points in an array and the distance between the last point
 * to the first one
 */
export const getSequencialDistance = (points: Point[]) => {
  return points.map((currentPoint, index) => {
    const isLastIndex = index >= points.length - 1;
    const nextPoint = isLastIndex ? points[0] : points[index + 1];

    return calculateDistance(currentPoint, nextPoint);
  });
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

/**
 * Rotate a point around other point
 */

export const rotateAround = (around: Point, point: Point, angle: number) => {
  let rotatedPoint = calculateRelativeCoordinate(point, around);
  rotatedPoint = rotatePoint(rotatedPoint, angle);

  rotatedPoint.x += around.x;
  rotatedPoint.y += around.y;

  return rotatedPoint;
};
