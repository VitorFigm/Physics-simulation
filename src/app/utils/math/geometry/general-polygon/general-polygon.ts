import { Point, View } from "@app/models";
import { getViewBoxCoordinates } from "app/utils/position";
import { getMeanOf } from "../../simple-calculations";
import { calculateDistance } from "../points";
import { Triangle } from "../triangle/triangle";

export class Polygon {
  constructor(public points: Point[]) {}

  static fromView(view: View) {
    const points = getViewBoxCoordinates(view);

    return new Polygon([
      points.bottomLeft,
      points.topLeft,
      points.topRight,
      points.bottomRight,
    ]);
  }
  /**
   * Compare two polygons and get the one that has the highest mean distance from barycenter to vertexes
   */
  static compare(polygon1: Polygon, polygon2: Polygon) {
    const meanDistance1 = getMeanOf(...polygon1.getAllRadius());
    const meanDistance2 = getMeanOf(...polygon2.getAllRadius());

    const bigger = meanDistance1 > meanDistance2 ? polygon1 : polygon2;
    const smaller = meanDistance1 < meanDistance2 ? polygon1 : polygon2;

    return { bigger, smaller };
  }

  /**
   * Check if two Polygons intersects taking triangles from consecutive vertexes of one polygon
   * and testing if any point of the other is inside those triangles
   */
  intersects(polygonToTest: Polygon) {
    const polygons = Polygon.compare(this, polygonToTest);
    for (const triangle of polygons.bigger.getTrianglesFromVertexes()) {
      for (const point of polygons.smaller.points) {
        if (triangle.contains(point)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Return triangles formed by consecutive vertexes
   */
  getTrianglesFromVertexes() {
    const barycenter = this.getBarycenter();
    return this.points.map((currentPoint, index) => {
      const isLastIndex = index >= this.points.length - 1;
      const nextPointIndex = isLastIndex ? 0 : index + 1;

      const nextPoint = this.points[nextPointIndex];

      return new Triangle([currentPoint, nextPoint, barycenter]);
    });
  }

  /**
   * Get barycenter of polygon calculating the mean of all points
   */
  getBarycenter() {
    return this.points.reduce(
      (accumulator, next) => {
        const xPosition = (accumulator.x += next.x / this.points.length);

        const yPosition = (accumulator.y += next.y / this.points.length);
        return {
          x: xPosition,
          y: yPosition,
        };
      },
      { x: 0, y: 0 }
    );
  }

  /**
   * Returns all distances between the barycenter to a vertex
   */
  getAllRadius() {
    const barycenter = this.getBarycenter();
    return this.points.map((point) => {
      return calculateDistance(barycenter, point);
    });
  }
  /**
   * Checks if at least one of the edge of two polygons intesects
   */
  // sideIntersects(polygon: Polygon) {
  //   for (const polygon1Line of this.getLines()) {
  //     for (const polygon2Line of polygon.getLines()) {
  //       const intersection = polygon1Line.getIntersection(polygon2Line);
  //       if (intersection) {
  //         return true;
  //       }
  //     }
  //   }

  //   return false;
  // }

  /**
   * Returns all line segment form each polygon's side
   */
  // private getLines() {
  //   return this.points.map((currentPoint, index) => {
  //     const isLastIndex = index >= this.points.length - 1;
  //     const nextPointIndex = isLastIndex ? 0 : index + 1;

  //     const nextPoint = this.points[nextPointIndex];

  //     return LineSegment.fromPoints(currentPoint, nextPoint);
  //   });
  // }
}
