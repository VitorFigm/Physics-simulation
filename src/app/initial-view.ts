import { ControledView, View } from "@app/types";
import { ValidImageName } from "assets";
import { StateHandler } from "./controllers/states/state-handler";

interface Figure extends ControledView, View {
  sprite: ValidImageName;
}

type InitialView = {
  [key: string]: Figure;
};

const standing = new StateHandler().getStates().stand();

export const INITIAL_VIEW: InitialView = {
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
} as const;
