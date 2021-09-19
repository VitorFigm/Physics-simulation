import { Point } from "@app/models";
type RealSubset = {
  min: number;
  max: number;
};

type RealSquaredSubset = { x: RealSubset; y: RealSubset };

const isValueInInterval = (value: number, start: number, end: number) => {
  return value >= start && value <= end;
};

export class LineSegment {
  constructor(
    public slope: number,
    public yIntersect: number,
    public from: Point,
    public to: Point
  ) {}

  static fromPoints(from: Point, to: Point) {
    const deltaX = to.x - from.x;

    if (deltaX === 0) {
      return new HorizontalLineSegment(from, to);
    }

    const deltaY = to.y - from.y;
    const slope = deltaY / deltaX;

    const yIntersect = from.y - slope * from.x;

    const line = new LineSegment(slope, yIntersect, from, to);
    return line;
  }

  /**
   * Return the intersection point of two lines.
   */
  getIntersection(line: LineSegment) {
    const x = (this.yIntersect - line.yIntersect) / (line.slope - this.slope);

    const possibleResult = this.evaluateAt(x);

    if (!possibleResult) {
      return;
    }

    if (!line.isInsideDomain(possibleResult)) {
      return;
    }

    // this.particleService.createDot(possibleResult);

    return possibleResult;
  }

  evaluateAt(pointX: number) {
    const y = this.slope * pointX + this.yIntersect;

    const possibleResult = { x: pointX, y };

    // if (possibleResult.y === this.domain?.y.max) {
    //   console.log(this.isInsideDomain(possibleResult));
    // }

    if (this.isInsideDomain(possibleResult)) {
      return possibleResult;
    }
  }

  isInsideDomain(point: Partial<Point>) {
    const domainXMin = Math.min(this.from.x, this.to.x);
    const domainXMax = Math.max(this.from.x, this.to.x);

    const domainYMin = Math.min(this.from.y, this.to.y);
    const domainYMax = Math.max(this.from.y, this.to.y);

    const isXInsideDomain =
      point.x != null
        ? isValueInInterval(point.x, domainXMin, domainXMax)
        : true;

    const isYInsideDomain =
      point.y != null
        ? isValueInInterval(point.y, domainYMin, domainYMax)
        : true;

    return isXInsideDomain && isYInsideDomain;
  }
}

class HorizontalLineSegment extends LineSegment {
  xCoordinate: number;

  constructor(public from: Point, public to: Point) {
    super(Infinity, Infinity, from, to);
    this._checkPoints();

    this.xCoordinate = from.x;
  }

  getIntersection(line: LineSegment) {
    return line.evaluateAt(this.xCoordinate);
  }

  evaluateAt(pointX: number) {
    return undefined;
  }

  private _checkPoints() {
    if (this.from.x !== this.to.x) {
      throw new Error(
        "Horizontal line's points must have the same x coordinate."
      );
    }
  }
}
