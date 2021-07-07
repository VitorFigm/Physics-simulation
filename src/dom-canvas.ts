const canvas = document.createElement("canvas");
// document.body.appendChild(canvas);

export const graphics = canvas.getContext("2d");

const adaptResolution = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
};

adaptResolution();
addEventListener("resize", adaptResolution);
