import { Point } from "@app/models";
import { calculateDistance, getSequencialDistance } from "../points";

type TrianglePoints = [Point, Point, Point];

export class Triangle {
  private _area: number;
  private _sidesLengths: number[];

  constructor(public points: TrianglePoints) {}

  /**
   * Get area of triangle using Heron formula:
   * https://www.onlinemath4all.com/images/heronsformula.png
   */
  get area() {
    if (!this._area) {
      const semiPerimeter = this.sidesLengths.reduce((accumulator, next) => {
        return accumulator + next / 2;
      }, 0);

      const differenceProducts = this.sidesLengths.reduce(
        (accumulator, next) => {
          return accumulator * (semiPerimeter - next);
        },
        1
      );

      this._area = Math.sqrt(semiPerimeter * differenceProducts);
    }

    return this._area;
  }

  get sidesLengths() {
    if (!this._sidesLengths) {
      this._sidesLengths = getSequencialDistance(this.points);
    }

    return this._sidesLengths;
  }

  /**
   * If the sum of all possible triangle from a points and 2 points of the triangle is equal the
   * triangle are, then this point is inside the Triangle
   */
  contains(pointToTest: Point) {
    const areaSum = this.points.reduce((accumulator, currentPoint, index) => {
      const isLastIndex = index >= this.points.length - 1;
      const nextPoint = isLastIndex ? this.points[0] : this.points[index + 1];

      const newTriangleArea = new Triangle([
        currentPoint,
        pointToTest,
        nextPoint,
      ]);

      return (accumulator += newTriangleArea.area);
    }, 0);

    return areaSum.toPrecision(6) === this.area.toPrecision(6);
  }
}
