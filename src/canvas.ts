const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
export const graphics = canvasElement.getContext("2d");

const adaptResolution = () => {
  canvasElement.width = innerWidth;
  canvasElement.height = innerHeight;
};

adaptResolution();
addEventListener("resize", adaptResolution);
