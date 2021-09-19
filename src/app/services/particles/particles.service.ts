import {
  GraphicalContext,
  GraphicalContextToken,
  Point,
  Position,
  View,
} from "@app/models";
import { RenderizationAPI } from "app/core/engines/graphics/graphical-api";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";

export class ParticleService {
  private _renderer = inject(RenderizationAPI);
  private _graphicalContext = inject(GraphicalContextToken) as GraphicalContext;
  private _idIterator = this._generateId();
  get id() {
    return this._idIterator.next().value;
  }

  constructor() {}

  createDot(at: Point) {
    const dot: View = {
      sprite: this._renderer.imageLoader.get("red-box").image,
      box: {
        height: 10,
        width: 10,
      },
      position: { ...at, angle: 0 },
    };
    const a = `dot` + this.id;
    console.log(a);

    this._graphicalContext[a] = dot;
  }

  private *_generateId() {
    let index = 0;
    while (true) {
      yield index++;
    }
  }
}
