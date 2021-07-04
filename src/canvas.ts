import "./canvas.scss";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const context = canvas.getContext("2d");

const changeResolution = () => {
  canvas.height = innerHeight;
  canvas.width = innerWidth;
};

changeResolution();
addEventListener("resize", changeResolution);
