import { State } from "../core";

export type ImageLoader = ReadonlyMap<string, HTMLImageElement>;

export abstract class GraphicalImplementation {
  static imageLoader: ImageLoader;
  static graphics: CanvasRenderingContext2D;
}

export type GraphicalAPI = typeof GraphicalImplementation;

export interface View {
  position: { x: number; y: number };
  width: number;
  height: number;
}

export interface ControledView extends View {
  state: State;
}

export interface FrameBuilder extends View {
  sprite: string;
}

export interface GraphicalContext {
  [contentName: string]: FrameBuilder;
}

export interface Subscription<T> {
  next: (value: T) => void;
  error?: (error: Error) => void;
}

export type Controller = (view: ControledView) => void;

export type InjectableConstructor<T = unknown, P = unknown> = new (
  props?: P
) => T;

export type Provider =
  | {
      provide: InjectableConstructor;
      useClasse: InjectableConstructor;
      //*
      /* Set it to true if you don't want the class being sigletons
       */
      injectMultiples?: boolean;
    }
  | InjectableConstructor;
