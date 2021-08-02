import { ControledView, State, View } from "@app/models";
import { of } from "@app/utils";
import { StateHandler } from "app/controllers/states/state-handler";
import { provide } from "app/core/inversion-of-control/inversion-of-control.engine";
import { KeyboardService } from "app/services/keyboard/keyboard.service";
import { KeyboardControl } from "./keyboard-control";

describe("KeyboardControl", () => {
  let keyboardControl: KeyboardControl;
  let mockKeyboardService: Partial<KeyboardService>;
  let setStateSpy: jest.SpyInstance;

  const mockView: Partial<ControledView> = {};
  const testKey = "a";
  const mockState: Partial<State> = {};

  const mockKeyMapper = {
    [testKey]: () => mockState as State,
  };

  beforeAll(() => {
    mockKeyboardService = {
      listenKeyDown() {
        return of();
      },
      listenKeyUp() {
        return of();
      },
    };

    const mockStateHandler = { setState(value: unknown) {} };
    setStateSpy = jest.spyOn(mockStateHandler, "setState");

    provide([
      { provide: KeyboardService, useValue: mockKeyboardService },
      { provide: StateHandler, useValue: mockStateHandler },
    ]);
    keyboardControl = new KeyboardControl({ view: mockView as ControledView });
  });

  it("should set state after keydown event", (done) => {
    jest
      .spyOn(mockKeyboardService, "listenKeyDown")
      .mockReturnValue(of(testKey));

    keyboardControl.mapKeyDownEvent(mockKeyMapper);
    setTimeout(() => {
      expect(setStateSpy).toBeCalledWith(mockView, mockState);
      done();
    }, 0);
  });

  it("should set state after keyup event", (done) => {
    jest.spyOn(mockKeyboardService, "listenKeyUp").mockReturnValue(of(testKey));

    keyboardControl.mapKeyUpEvent(mockKeyMapper);
    setTimeout(() => {
      expect(setStateSpy).toBeCalledWith(mockView, mockState);
      done();
    }, 0);
  });
});
