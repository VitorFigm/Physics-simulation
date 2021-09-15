import { FullArm } from "./controllers/arm/arm.controler";
import { Player } from "./controllers/player/player.controller";
import { RenderizationAPI } from "./core/engines/graphics/graphical-api";
import { inject } from "./core/inversion-of-control/inversion-of-control.engine";
import { View } from "./models";

export const createInitialView = () => {
  const api = inject(RenderizationAPI);

  const fullArm: FullArm = {
    box: {
      height: 150,
      width: 50,
    },
    position: {
      x: 0,
      y: 125,
      angle: Math.PI / 6,
    },
    components: {
      arm: {
        sprite: api.imageLoader.get("blue-box").image,
        box: {
          height: 75,
          width: 25,
        },
        position: {
          x: 0,
          y: 0,
          angle: 0,
        },
      },
      forearm: {
        sprite: api.imageLoader.get("blue-box").image,
        box: {
          height: 75,
          width: 25,
        },
        position: {
          x: 0,
          y: 75,
          angle: Math.PI / 6,
        },
      },
    },
  };

  const player: Player = {
    sprite: api.imageLoader.get("box").image,
    box: {
      height: 250,
      width: 50,
    },

    position: {
      x: 200,
      y: 0,
      angle: 0,
    },
    components: {
      fullArm,
    },
  };

  const enemy: View = {
    sprite: api.imageLoader.get("box").image,
    box: {
      height: 100,
      width: 30,
    },
    position: {
      x: 500,
      y: 0,
      angle: 0,
    },
  };

  return {
    player,
    enemy,
  };
};
