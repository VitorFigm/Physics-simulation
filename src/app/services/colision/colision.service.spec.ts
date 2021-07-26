import { View } from "@app/models";
import { Observable, of } from "@app/utils";
import { provide } from "app/core/inversion-of-control/inversion-of-control.engine";
import { NextFrameService } from "../next-frame/next-frame.service";
import { ColisionService } from "./colision.service";

describe("ColisionService", () => {
  let colisionService: ColisionService;
  let mockNextFrameService: Partial<NextFrameService>;
  beforeEach(() => {
    mockNextFrameService = {
      checkFramePass() {
        return of(true);
      },
    };

    provide([{ provide: NextFrameService, useValue: mockNextFrameService }]);

    colisionService = new ColisionService();
  });

  it("shoud detect colision", (done) => {
    const mockView1: View = {
      position: { x: 0, y: 0 },
      width: 1,
      height: 1,
    };

    const mockView2: View = {
      position: { x: 0.5, y: 0.5 },
      width: 1,
      height: 1,
    };

    const colision$ = colisionService.observeCollision(mockView1);
    colisionService.observeCollision(mockView2);

    colision$.subscribe({
      next(value) {
        expect(value).toBe(mockView2);
        done();
      },
    });
  });

  it("shoud not emit value when colision doesn't happens", (done) => {
    const mockView1: View = {
      position: { x: 0, y: 0 },
      width: 1,
      height: 1,
    };

    const mockView2: View = {
      position: { x: 2, y: 2 },
      width: 1,
      height: 1,
    };

    let colided = false;

    const colision$ = colisionService.observeCollision(mockView1);
    colisionService.observeCollision(mockView2);

    colision$.subscribe({
      next() {
        colided = true;
      },
    });

    setTimeout(() => {
      expect(colided).toBeFalsy();
      done()
    }, 0);
  });
});
