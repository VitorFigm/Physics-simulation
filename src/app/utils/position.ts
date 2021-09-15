import { GraphicalContext, Point, View } from "@app/models";
import { rotatePoint } from "./math/geometry";

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
