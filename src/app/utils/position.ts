import { Point, Position, View } from "@app/models";
import { rotateAround, rotatePoint } from "./math/geometry/points";

export const setAbosolutePositon = (
  view: View,
  relativeTo: View["position"] = { x: 0, y: 0, angle: 0 }
) => {
  const rotatedPosition = rotatePoint(view.position, relativeTo.angle);

  view.position.absolute = {
    x: relativeTo.x + rotatedPosition.x,
    y: relativeTo.y + rotatedPosition.y,
    angle: view.position.angle + relativeTo.angle,
  };
};

/**
 * Transform view's cartesian coordinate into (that this game is using for simplicity) to the canvas default coordinates
 * it make the origin (0,0) at bottom left of the window and make the View position the bottom middle point in the image
 *
 * .
 */

export const toBrowserCoordinates = (
  position: View["position"],
  box: View["box"],
  graphics: CanvasRenderingContext2D
) => {
  return {
    x: position.x - box.width / 2,
    y: graphics.canvas.height - position.y - box.height,
    angle: position.angle,
  };
};

/**
 * Transform the browser coordinates system to the cartesian
 */

export const toCartesianCoordinates = (position: Point) => {
  return {
    x: position.x,
    y: window.innerHeight - position.y,
  };
};

/**
 * Get coordinates of the bottom left and the top right points of the view's box
 */
export const getViewBoxCoordinates = (view: View) => {
  const middleBottomPoint = view.position.absolute as Position;

  const angle = view.position.absolute?.angle as number;

  const bottomLeft = rotateAround(
    middleBottomPoint,
    {
      x: middleBottomPoint.x - view.box.width / 2,
      y: middleBottomPoint.y,
    },
    angle
  );

  const topLeft = rotateAround(
    middleBottomPoint,
    {
      x: middleBottomPoint.x - view.box.width / 2,
      y: middleBottomPoint.y + view.box.height,
    },
    angle
  );

  const topRight = rotateAround(
    middleBottomPoint,
    {
      x: middleBottomPoint.x + view.box.width / 2,
      y: middleBottomPoint.y + view.box.height,
    },
    angle
  );

  const bottomRight = rotateAround(
    middleBottomPoint,
    {
      x: middleBottomPoint.x + view.box.width / 2,
      y: middleBottomPoint.y,
    },
    angle
  );

  return { bottomLeft, topLeft, topRight, bottomRight };
};
