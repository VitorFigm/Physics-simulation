import { State } from "../core";

export type Sprite = {
  frameCount: number;
  image: HTMLImageElement;
};

export type ImageLoader = ReadonlyMap<string, Sprite>;

export interface View {
  position: { x: number; y: number };
  box: { width: number; height: number; paddingX?: number; paddingY?: number };
  direction: "left" | `right`;
  state: State;
  sprite?: HTMLImageElement | HTMLCanvasElement;
}

export interface GraphicalContext {
  [contentName: string]: View;
}

export interface Subscription<T> {
  next: (value: T) => void;
  error?: (error: Error) => void;
}

export type Unsubscriber = {
  unsubscribe: () => void;
};

type Control<T> = {
  next: T;
};
export type Controller<T = unknown> = (
  view: View,
  ...references: View[]
) => void | T;

export type InjectableConstructor<T = unknown, P = unknown> = new (
  props?: P
) => T;

export type Provider<T = unknown, P = unknown> =
  | {
      provide: InjectableConstructor<T, P>;
      useClass: InjectableConstructor<T, P>;
      //*
      /* Set it to true if you don't want the class being sigletons
       */
      injectMultiples?: boolean;
    }
  | {
      provide: InjectableConstructor<T, P>;
      useValue: T;
      //*
      /* Set it to true if you don't want the class being sigletons
       */
    }
  | InjectableConstructor;
