import { GraphicalAPI, GraphicalContext } from "@app/models";
import { provide } from "app/core/inversion-of-control/inversion-of-control.engine";
import { cropImage } from "app/utils/image-cropper/image-cropper";
import { Graphics } from "./graphics.engine";

describe("Graphics", () => {
  let square: HTMLImageElement;
  let graphicalEngine: Graphics;
  let graphicalAPI: Partial<GraphicalAPI>;

  const mockImageName = "square";

  beforeAll((end) => {
    square = getSquareImage(2, 2);

    square.onload = () => {
      graphicalAPI = {
        graphics: document
          .createElement("canvas")
          .getContext("2d") as CanvasRenderingContext2D,
      };
      provide([{ provide: GraphicalAPI, useValue: graphicalAPI }]);
      graphicalEngine = new Graphics();
      end();
    };
  });

  it("should draw an image at the bottom left of the canvas", (done) => {
    const context: GraphicalContext = {
      square: {
        box: {
          height: square.height,
          width: square.width,
        },
        position: { x: square.width / 2, y: 0, angle: 0 },
        sprite: square,
        stateMachine: {} as any,
      },
    };

    graphicalEngine.drawCanvas(context);
    const { canvas } = graphicalAPI.graphics as CanvasRenderingContext2D;
    const cut = {
      x: 0,
      y: canvas.height - square.height,
      width: square.width,
      height: square.height,
    };

    const canvasImage = new Image();
    canvasImage.src = canvas.toDataURL();

    canvasImage.onload = () => {
      const canvasSection = cropImage(
        canvasImage,
        cut,
        true
      ) as HTMLImageElement;
      expect(canvasSection.src).toEqual(square.src);
      done();
    };
  });

  function getSquareImage(width: number, height: number) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.height = height;
    tempCanvas.width = width;

    const tempContext = tempCanvas.getContext("2d") as CanvasRenderingContext2D;
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    const square = new Image();
    square.src = tempCanvas.toDataURL();

    return square;
  }
});
