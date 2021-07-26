import { GraphicalAPI, GraphicalContext } from "@app/models";
import { provide } from "app/core/inversion-of-control/inversion-of-control.engine";
import { Graphics } from "./graphics.engine";

type CanvasCut = {
  width: number;
  height: number;
  x: number;
  y: number;
};

describe("Graphics", () => {
  let square: HTMLImageElement;
  let graphicalEngine: Graphics;
  let graphicalAPI: GraphicalAPI;

  const mockImageName = "square";

  beforeAll((end) => {
    square = getSquareImage(2, 2);

    square.onload = () => {
      graphicalAPI = {
        imageLoader: getMockImageMap(square),
        graphics: document.createElement("canvas").getContext("2d"),
      };
      provide([{ provide: GraphicalAPI, useValue: graphicalAPI }]);
      graphicalEngine = new Graphics();
      end();
    };
  });

  it("should draw an image at the bottom left of the canvas", () => {
    const context: GraphicalContext = {
      square: {
        height: square.height,
        width: square.width,
        position: { x: 0, y: 0 },
        sprite: mockImageName,
      },
    };

    graphicalEngine.drawCanvas(context);
    const { canvas } = graphicalAPI.graphics;
    const cut: CanvasCut = {
      x: 0,
      y: canvas.height - square.height,
      width: square.width,
      height: square.height,
    };

    const canvasSection = cutSectionFromCanvas(canvas, cut);
    expect(canvasSection.src).toEqual(square.src);
  });

  function getMockImageMap(image: HTMLImageElement) {
    const imageMap = new Map();
    imageMap.set(mockImageName, image);
    return imageMap;
  }

  function getSquareImage(width: number, height: number) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.height = height;
    tempCanvas.width = width;

    const tempContext = tempCanvas.getContext("2d");
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    const square = new Image();
    square.src = tempCanvas.toDataURL();

    return square;
  }
});

/**
 * get an image of a section of a canvas with a drawing
 * For instance:
 * if we have a
 * 10 x 10 canvas passing
 *  cut = {
 *    width: 5,
 *    height: 5
 *    x: 0,
 *    y: 10,
 * }
 *
 * Would get a "snapshot" of half the the canvas.
 */

function cutSectionFromCanvas(canvas: HTMLCanvasElement, cut: CanvasCut) {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.height = cut.height;
  tempCanvas.width = cut.width;

  const context = tempCanvas.getContext("2d");

  const { position, size, canvasTranslation, canvasWidth } =
    getCutCoordinates(cut);

  context.drawImage(
    canvas,
    ...position,
    ...size,
    ...canvasTranslation,
    ...canvasWidth
  );
  const image = new Image();
  image.src = tempCanvas.toDataURL();
  return image;
}

function getCutCoordinates(cut: CanvasCut) {
  return {
    position: [cut.x, cut.y],
    size: [cut.width, cut.height],
    canvasTranslation: [0, 0],
    canvasWidth: [cut.width, cut.height],
  } as const;
}
