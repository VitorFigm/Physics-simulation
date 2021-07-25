import { ControledView, View } from "@app/models";
import { ValidImageName } from "assets";
import { Stading } from "./controllers/states/standing.state";
import { inject } from "./core/inversion-of-control/inversion-of-control.engine";

interface Figure extends ControledView, View {
  sprite: ValidImageName;
}

type InitialView = {
  [key: string]: Figure;
};
export const createInitialView = (): InitialView => {
  const standing = inject(Stading);

  return {
    player: {
      state: standing,
      sprite: "char",
      height: 100,
      position: {
        x: 20,
        y: 0,
      },
      width: 30,
    },
  };
};
