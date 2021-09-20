import { ActionEmitter } from "app/controllers/states/state-machine";

export type Sprite = {
  image: HTMLImageElement;
};

export type ImageLoader = ReadonlyMap<string, Sprite>;

export type Position = { x: number; y: number; angle: number };

export type Box = {
  width: number;
  height: number;
};

export interface View {
  position: Position & { absolute?: Position };
  box: Box;
  actionEmitter?: ActionEmitter;
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
      multiplesInstances?: boolean;
    }
  | {
      provide: InjectableConstructor<T, P>;
      useValue: T;
      //*
      /* Set it to true if you don't want the class being singletons
       */
    }
  | InjectableConstructor;

export type Point = { x: number; y: number };
