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
    position: { x: number; y: number }
  ) {
    const context = this._api.graphics;

    const positionScaler = figure.direction === "right" ? -1 : 1;
    const shouldSumWidth = figure.direction === "right" ? 1 : 0;

    context.save();
    context.scale(positionScaler, 1);

    this._api.graphics.drawImage(
      image,
      positionScaler * position.x - shouldSumWidth * figure.box.width,
      position.y,
      figure.box.width,
      figure.box.height
    );

    context.restore();
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
