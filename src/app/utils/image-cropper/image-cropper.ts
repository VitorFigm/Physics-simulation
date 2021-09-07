type CutParameters = {
  width: number;
  height: number;
  x: number;
  y: number;
};

/**
 * get an section of a image
 * For instance:
 * if we have a
 * 10 x 5 canvas passing
 *  cut = {
 *    width: 5,
 *    height: 5
 *    x: 0,
 *    y: 5,
 * }
 *
 * Would get a "snapshot" of the top half the the canvas.
 */

export const cropImage = (
  image: HTMLImageElement,
  cut: CutParameters,
  convertToImage = false
) => {
  const cropImageCanvas = document.createElement("canvas");
  cropImageCanvas.height = cut.height;
  cropImageCanvas.width = cut.width;

  const context = cropImageCanvas.getContext("2d");

  const { position, size, canvasTranslation, canvasWidth } =
    getCutCoordinates(cut);
  console.log();

  context.drawImage(
    image,
    ...position,
    ...size,
    ...canvasTranslation,
    ...canvasWidth
  );
  if (convertToImage) {
    const croppedImage = new Image();
    croppedImage.src = cropImageCanvas.toDataURL();
    return croppedImage;
  }

  return cropImageCanvas;

  function getCutCoordinates(cut: CutParameters) {
    return {
      position: [cut.x, cut.y],
      size: [cut.width, cut.height],
      canvasTranslation: [0, 0],
      canvasWidth: [cut.width, cut.height],
    } as const;
  }
};
