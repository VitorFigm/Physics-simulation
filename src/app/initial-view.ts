import { GraphicalContext } from "@app/models";
import { Stading } from "./controllers/states/standing.state";
import { RenderizationAPI } from "./core/engines/graphics/graphical-api";
import { inject } from "./core/inversion-of-control/inversion-of-control.engine";

export const createInitialView = () => {
  const api = inject(RenderizationAPI);

  return {
    player: {
      state: inject(Stading),
      direction: "left",
      box: {
        height: 200,
        width: 100,
      },

      position: {
        x: 20,
        y: 0,
      },
    },
    enemy: {
      state: inject(Stading),
      sprite: api.imageLoader.get("char_idle").image,
      direction: "right",
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
