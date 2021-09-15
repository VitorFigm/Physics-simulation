import { View } from "@app/models";
import { Observable, of } from "@app/utils";
import { provide } from "app/core/inversion-of-control/inversion-of-control.engine";
import { NextFrameService } from "../next-frame/next-frame.service";
import { CollisionService } from "./colision.service";

describe("CollisionService", () => {
  let collisionService: CollisionService;
  let mockNextFrameService: Partial<NextFrameService>;
  beforeEach(() => {
    mockNextFrameService = {
      checkFramePass() {
        return of(true);
      },
    };

    provide([{ provide: NextFrameService, useValue: mockNextFrameService }]);

    collisionService = new CollisionService();
  });

  it("should detect collision", (done) => {
    const mockView1: Partial<View> = {
      position: { x: 0, y: 0, angle: 0 },
      box: {
        width: 1,
        height: 1,
      },
    };

    const mockView2: Partial<View> = {
      position: { x: 0.5, y: 0.5, angle: 0 },
      box: {
        width: 1,
        height: 1,
      },
    };

    const collision$ = collisionService.observeCollision(mockView1 as View);
    collisionService.observeCollision(mockView2 as View);

    collision$.subscribe({
      next(value) {
        expect(value).toBe(mockView2);
        done();
      },
    });
  });

  it("should not emit value when collision doesn't happens", (done) => {
    const mockView1: Partial<View> = {
      position: { x: 0, y: 0, angle: 0 },
      box: {
        width: 1,
        height: 1,
      },
    };

    const mockView2: Partial<View> = {
      position: { x: 2, y: 2, angle: 0 },
      box: {
        width: 1,
        height: 1,
      },
    };

    let collided = false;

    const collision$ = collisionService.observeCollision(mockView1 as View);
    collisionService.observeCollision(mockView2 as View);

    collision$.subscribe({
      next() {
        collided = true;
      },
    });

    setTimeout(() => {
      expect(collided).toBeFalsy();
      done();
    }, 0);
  });
});
