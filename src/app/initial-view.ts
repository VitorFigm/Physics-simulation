import { ForeArm, FullArm } from "./controllers/arm/arm.controller";
import { Player } from "./controllers/player/player.controller";
import { RenderizationAPI } from "./core/engines/graphics/graphical-api";
import { inject } from "./core/inversion-of-control/inversion-of-control.engine";
import { GraphicalContext, View } from "./models";

export const createInitialView = () => {
  const api = inject(RenderizationAPI);

  const foreArm: ForeArm = {
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
    components: {
      hand: {
        sprite: api.imageLoader.get("red-box").image,
        box: {
          height: 25,
          width: 25,
        },
        position: {
          x: 0,
          y: 50,
          angle: 0,
        },
      },
    },
  };

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
      foreArm,
    },
  };

  const player: Player = {
    sprite: api.imageLoader.get("box").image,
    box: {
      height: 250,
      width: 50,
    },

    position: {
      x: 100,
      y: 10,
      angle: 0,
    },
    components: {
      fullArm,
    },
  };

  const enemy: View = {
    sprite: api.imageLoader.get("box").image,
    box: {
      height: 180,
      width: 30,
    },
    position: {
      x: 500,
      y: 10,
      angle: 0,
    },
  };

  const ballBucket: View = {
    sprite: api.imageLoader.get("box").image,
    box: {
      height: 50,
      width: 200,
    },
    position: {
      x: 0,
      y: 0,
      angle: 0,
    },
  };

  return {
    player,
    enemy,
    ballBucket,
  };
};
