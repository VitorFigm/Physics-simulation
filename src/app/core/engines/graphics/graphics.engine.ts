import { FrameBuilder, GraphicalContext, GraphicalAPI } from "@app/types";

export abstract class Graphics {
  static drawCanvas(graphicalContext: GraphicalContext, api: GraphicalAPI) {
    Object.values(graphicalContext).forEach((value) =>
      Graphics.drawObject(value, api)
    );
  }

  static drawObject(
    figure: FrameBuilder,
    { graphics, imageLoader }: GraphicalAPI
  ) {
    Graphics.clearCanvas(graphics);

    const position = Graphics.translatePosition(
      graphics,
      figure.position.x,
      figure.position.y,
      figure.height
    );
    const loadedSprite = imageLoader.get(figure.sprite);
    loadedSprite.width = figure.width;
    loadedSprite.height = figure.height;

    graphics.drawImage(
      loadedSprite,
      0,
      0,
      figure.width,
      figure.height,
      position.x,
      position.y,
      figure.width,
      figure.height
    );
  }

  static clearCanvas(graphics: CanvasRenderingContext2D) {
    graphics.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height);
  }

  static translatePosition(
    graphics: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number
  ) {
    return {
      x,
      y: graphics.canvas.height - y - height,
    };
  }
}

export const { drawCanvas } = Graphics;
