import { View, GraphicalContext } from "app/types";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { toBrowserCoordinates } from "app/utils/position";
import { GraphicalAPI } from "app/core/providers";

export class Graphics {
  private _api = inject(GraphicalAPI);

  drawCanvas(graphicalContext: GraphicalContext) {
    this._clearCanvas();
    this._drawComponentTree(graphicalContext);
  }

  private _drawComponentTree(graphicalContext: GraphicalContext) {
    Object.values(graphicalContext).forEach((view) => {
      const absolutePosition = view.position.absolute ?? view.position;
      const spritePosition = toBrowserCoordinates(
        absolutePosition,
        view.box,
        this._api.graphics
      );

      if (view.sprite) {
        this._showImage(view.sprite, view.box, spritePosition);
      }

      if (view.components) {
        this._drawComponentTree(view.components);
      }
    });
  }

  private _showImage(
    image: HTMLImageElement,
    box: View["box"],
    position: View["position"]
  ) {
    const context = this._api.graphics;

    context.save();
    const newReference = {
      x: position.x + box.width / 2,
      y: position.y + box.height,
    };
    context.translate(newReference.x, newReference.y);
    context.rotate(position.angle);

    newReference.x = -box.width / 2;
    newReference.y = -box.height;
    context.drawImage(
      image,
      newReference.x,
      newReference.y,
      box.width,
      box.height
    );

    context.restore();
  }

  private _flipFigure(
    position: View["position"],
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
}
