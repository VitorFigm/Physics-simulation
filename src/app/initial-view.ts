import { GraphicalContext } from "@app/models";
import { RenderizationAPI } from "./core/engines/graphics/graphical-api";
import { inject } from "./core/inversion-of-control/inversion-of-control.engine";

export const createInitialView = () => {
  const api = inject(RenderizationAPI);

  return {
    player: {
      sprite: api.imageLoader.get("box").image,
      direction: "right",
      box: {
        height: 200,
        width: 100,
      },

      position: {
        x: 0,
        y: 0,
      },
    },
    enemy: {
      sprite: api.imageLoader.get("box").image,
      direction: "left",
      box: {
        height: 100,
        width: 30,
      },
      position: {
        x: 500,
        y: 0,
      },
    },
  } as GraphicalContext;
};
