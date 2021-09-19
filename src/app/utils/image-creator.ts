export const createImage = (
  imageSize: { height: number; width: number },
  drawer: (context: CanvasRenderingContext2D) => void
) => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.height = imageSize.height;
  tempCanvas.width = imageSize.width;
  const tempContext = tempCanvas.getContext("2d") as CanvasRenderingContext2D;
  drawer(tempContext);

  const square = new Image();
  square.src = tempCanvas.toDataURL();

  return square;
};
