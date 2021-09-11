import { View, GraphicalContext, GraphicalAPI } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { flipImage } from "app/utils/image-flipper/image-flipper";

export class Graphics {
  private _api = inject(GraphicalAPI);

  drawCanvas(graphicalContext: GraphicalContext) {
    this._clearCanvas();
    Object.values(graphicalContext).forEach((value) => {
      this._drawObject(value);
    });
  }

  private _drawObject(figure: View) {
    const position = this._translatePosition(
      this._api.graphics,
      figure.position.x,
      figure.position.y,
      figure.box.height
    );
    const loadedSprite = figure.sprite;
    if (loadedSprite) {
      this._showImage(loadedSprite as HTMLImageElement, figure, position);
    }
  }

  private _showImage(
    image: HTMLImageElement,
    figure: View,
    position: Position
  ) {
    const context = this._api.graphics;

    context.save();

    if (figure.direction === "left") {
      this._flipFigure(position, figure.box.width, context);
    }

    this._api.graphics.drawImage(
      image,
      position.x,
      position.y,
      figure.box.width,
      figure.box.height
    );

    context.restore();
  }

  private _flipFigure(
    position: Position,
    figureWidth: number,
    context: CanvasRenderingContext2D
  ) {
    position.x = -position.x - figureWidth;
    const flipScaler = -1;
    context.scale(flipScaler, 1);
  }

  private _clearCanvas() {
    const { width, height } = this._api.graphics.canvas;
    this._api.graphics.clearRect(0, 0, width, height);
  }

  /**
   * Transform the canvas coordinate system into cartesian (so going up means increasing y coordinate ) with
   * origin at bottom left of the window.
   */
  private _translatePosition(
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

type Position = { x: number; y: number };
