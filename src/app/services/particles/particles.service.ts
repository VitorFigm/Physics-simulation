import {
  GraphicalContext,
  GraphicalContextToken,
  Point,
  Position,
  View,
} from "@app/models";
import { RenderizationAPI } from "app/core/engines/graphics/graphical-api";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";

type ParticleController = {
  removeParticle: () => void;
};

export class ParticleService {
  private _renderer = inject(RenderizationAPI);
  private _graphicalContext = inject(GraphicalContextToken) as GraphicalContext;
  private _idIterator = this._generateId();
  private get _id() {
    return this._idIterator.next().value;
  }

  constructor() {}

  renderParticle(particle: View) {
    const particleId = `particle ${this._id}`;

    this._graphicalContext[particleId] = particle;

    const controller: ParticleController = {
      removeParticle: () => {
        delete this._graphicalContext[particleId];
      },
    };

    return controller;
  }

  private *_generateId() {
    let index = 0;
    while (true) {
      yield index++;
    }
  }
}
