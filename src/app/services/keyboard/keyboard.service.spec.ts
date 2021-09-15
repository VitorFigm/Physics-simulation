import { Observable } from "@app/utils";
import { provide } from "app/core/inversion-of-control/inversion-of-control.engine";
import { NextFrameService } from "../next-frame/next-frame.service";
import { KeyboardService } from "./keyboard.service";

describe("KeyboardService", () => {
  let keyboardService: KeyboardService;
  let mockNextFrameService: Partial<NextFrameService>;

  beforeEach(() => {
    mockNextFrameService = {
      checkFramePass() {
        return new Observable((subscriber) => {
          setTimeout(() => {
            subscriber.next(true);
          }, 0);
        });
      },
    };

    provide([{ provide: NextFrameService, useValue: mockNextFrameService }]);

    keyboardService = new KeyboardService();
  });

  it("should detect key pressed", (end) => {
    const keyToPress = "a";

    keyboardService.listenKeyPress(keyToPress).subscribe({
      next(key) {
        expect(key).toEqual(keyToPress);
        end();
      },
    });

    pressKey(keyToPress);
  });
});

function pressKey(key: string) {
  const event = new KeyboardEvent("keydown", { key });
  dispatchEvent(event);
}
