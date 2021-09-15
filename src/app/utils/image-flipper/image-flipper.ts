export const flipImage = (image: HTMLImageElement, convertToImage = false) => {
  const imageCanvas = document.createElement("canvas");
  imageCanvas.height = image.height;
  imageCanvas.width = image.width;

  const context = imageCanvas.getContext("2d") as CanvasRenderingContext2D;
  context.translate(image.width, 0);
  context.scale(-1, 1);
  context.drawImage(image, 0, 0);

  if (convertToImage) {
    const invertedImage = new Image();
    invertedImage.src = imageCanvas.toDataURL();
    return invertedImage;
  }

  return imageCanvas;
};
