import { FrameBuilder, GraphicalContext, GraphicalAPI } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";

export class Graphics {
  private _api = inject(GraphicalAPI);

  drawCanvas(graphicalContext: GraphicalContext) {
    this._clearCanvas();
    Object.values(graphicalContext).forEach((value) => {
      this._drawObject(value);
    });
  }

  private _drawObject(figure: FrameBuilder) {
    const position = this._translatePosition(
      this._api.graphics,
      figure.position.x,
      figure.position.y,
      figure.height
    );
    const loadedSprite = this._api.imageLoader.get(figure.sprite);
    loadedSprite.width = figure.width;
    loadedSprite.height = figure.height;

    this._showImage(loadedSprite, figure, position);
  }

  private _showImage(
    image: HTMLImageElement,
    figure: FrameBuilder,
    position: { x: number; y: number }
  ) {
    this._api.graphics.drawImage(
      image,
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

  private _clearCanvas() {
    const { width, height } = this._api.graphics.canvas;
    this._api.graphics.clearRect(0, 0, width, height);
  }

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
