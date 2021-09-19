import { Point, View } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { ParticleService } from "app/services/particles/particles.service";
import { getViewBoxCoordinates } from "app/utils/position";
import { LineSegment } from "../line";
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
   * Check if two Polygons intersects taking triangles from consecutive vertexes of one polygon
   * and testing if any point of the other is inside those triangles
   */
  intersects(polygonToTest: Polygon) {
    for (const triangle of this.getTrianglesFromVertexes()) {
      for (const point of polygonToTest.points) {
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
