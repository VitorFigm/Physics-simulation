import { Point, View } from "@app/models";
import { getViewBoxCoordinates } from "app/utils/position";
import { getMeanOf } from "../../simple-calculations";
import { LineSegment } from "../line/line";
import { calculateDistance, getSequencialDistance } from "../points";
import { Triangle } from "../triangle/triangle";

export class Polygon {
  private _barycenter: Point;
  private _internalTriangles: Triangle[];
  private _area: number;
  private _sidesLengths: number[];
  private _sideSegments: LineSegment[];

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
   * Get barycenter of polygon calculating the mean of all points
   */
  get barycenter() {
    if (!this._barycenter) {
      this._barycenter = this.points.reduce(
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

    return this._barycenter;
  }

  /**
   * Return triangles formed by consecutive vertexes
   */
  get internalTriangles() {
    if (!this._internalTriangles) {
      this._internalTriangles = this.points.map((currentPoint, index) => {
        const isLastIndex = index >= this.points.length - 1;
        const nextPointIndex = isLastIndex ? 0 : index + 1;

        const nextPoint = this.points[nextPointIndex];

        return new Triangle([currentPoint, nextPoint, this.barycenter]);
      });
    }

    return this._internalTriangles;
  }

  get sidesLengths() {
    if (!this._sidesLengths) {
      this._sidesLengths = getSequencialDistance(this.points);
    }

    return this._sidesLengths;
  }

  /**
   * Returns the area of the polygon using the sum of the internal triangles area.
   */
  get area() {
    if (!this._area) {
      this._area = this.internalTriangles.reduce((accumulator, triangle) => {
        return accumulator + triangle.area;
      }, 0);
    }

    return this._area;
  }

  get sideSegments() {
    if (!this._sideSegments) {
      this._sideSegments = this.points.map((currentPoint, index) => {
        const isLastIndex = index >= this.points.length - 1;
        const nextPointIndex = isLastIndex ? 0 : index + 1;

        const nextPoint = this.points[nextPointIndex];

        return LineSegment.fromPoints(currentPoint, nextPoint);
      });
    }

    return this._sideSegments;
  }

  /**
   * Returns the polygon with the largest area.
   */
  static compare(polygon1: Polygon, polygon2: Polygon) {
    const bigger = polygon1.area > polygon2.area ? polygon1 : polygon2;

    const smaller = polygon1.area < polygon2.area ? polygon1 : polygon2;

    return { bigger, smaller };
  }

  /**
   * **Two polygons NOT intersects if:**
   * The distance from one barycenter to another is greater than
   * the greatest radius of the one of the polygons
   *
   * This test takes linear O(n+m) time in relation to
   * the Polygons's side number(n and m)
   *
   * **Two polygons intersects if:**
   * case 2: at least one point inside the smaller
   * case 3: at least one line from a polygon intersects
   * with a line from the other
   *
   * case 2 and case 3 are O(n*m) or O(n²)
   */
  intersects(polygonToTest: Polygon) {
    if (this.isDistantFrom(polygonToTest)) {
      return false;
    }

    const polygons = Polygon.compare(this, polygonToTest);
    for (const point of polygons.smaller.points) {
      if (polygons.bigger.contains(point)) {
        return true;
      }
    }

    for (const line of polygonToTest.sideSegments) {
      if (this.sideIntersectsWithLine(line)) {
        return true;
      }
    }

    return false;
  }

  isDistantFrom(polygon: Polygon) {
    const biggestRadius1 = Math.max(...this.sidesLengths);
    const biggestRadius2 = Math.max(...polygon.sidesLengths);

    const distance = calculateDistance(polygon.barycenter, this.barycenter);
    return distance > biggestRadius1 && distance > biggestRadius2;
  }

  /**
   * Check if Polygon contains a point checking if any of it internal triangles contains that point
   */
  contains(point: Point) {
    for (const triangle of this.internalTriangles) {
      if (triangle.contains(point)) {
        return true;
      }
    }

    return false;
  }

  sideIntersectsWithLine(line: LineSegment) {
    for (const line of this.sideSegments) {
      if (line.intersects(line)) {
        return true;
      }
    }

    return false;
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
