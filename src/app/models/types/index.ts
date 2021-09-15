import { FiniteStateMachine } from "app/controllers/states/state-machine";

export type Sprite = {
  image: HTMLImageElement;
};

export type ImageLoader = ReadonlyMap<string, Sprite>;

type Postition = { x: number; y: number; angle: number };
export interface View {
  position: Postition & { absolute?: Postition };
  box: { width: number; height: number; paddingX?: number; paddingY?: number };
  stateMachine?: FiniteStateMachine;
  sprite?: HTMLImageElement;
  components?: GraphicalContext;
}

export interface GraphicalContext {
  [contentName: string]: View;
}

export interface Subscriber<T> {
  next: (value: T) => void;
  error?: (error: Error) => void;
}

export interface Subscription {
  unsubscribe: () => void;
}

export type Controller<T = unknown> = (
  view: View,
  ...references: View[]
) => void | T;

export type InjectableConstructor<T = any, P = any> = new (props: P) => T;

export type Provider<T = unknown, P = unknown> =
  | {
      provide: InjectableConstructor<T, P>;
      useClass: InjectableConstructor<T, P>;
      //*
      /* Set it to true if you don't want the class being singletons
       */
      injectMultiples?: boolean;
    }
  | {
      provide: InjectableConstructor<T, P>;
      useValue: T;
      //*
      /* Set it to true if you don't want the class being singletons
       */
    }
  | InjectableConstructor;

export type FighterAction =
  | "goLeft"
  | "goRight"
  | "jump"
  | "endJump"
  | "attack";
export type FighterStateName = "standing" | "moving" | "falling" | "jumping";

export type ArmAction = "control" | "loose";
export type ArmStateName = "falling" | "controlling";

export type Point = { x: number; y: number };
