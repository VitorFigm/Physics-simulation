export type ImageLoader = ReadonlyMap<string, HTMLImageElement>;

export abstract class GraphicalImplementation {
  static imageLoader: ImageLoader;
  static graphics: CanvasRenderingContext2D;
}

export type GraphicalAPI = typeof GraphicalImplementation;

export type Contructor = new () => unknown;

export type Context = {
  Inject<T>(token: T): T;
};

export type GraphicalContext = {
  [contentName: string]: Figure;
};

export type Figure = {
  sprite: string;
  position: { x: number; y: number };
  width: number;
  height: number;
};
