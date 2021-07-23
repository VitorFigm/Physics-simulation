import { State } from "../core";

export type ImageLoader = ReadonlyMap<string, HTMLImageElement>;

export abstract class GraphicalImplementation {
  static imageLoader: ImageLoader;
  static graphics: CanvasRenderingContext2D;
}

export type GraphicalAPI = typeof GraphicalImplementation;

type Constructor<T> = new (...args: any) => T;

export type Context = {
  Inject<T>(
    token: Constructor<T>,
    ...params: ConstructorParameters<Constructor<T>>
  ): T;
};

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

export type Controller = (context: Context, view: ControledView) => void;
