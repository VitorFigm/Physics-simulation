import { KeyboardService } from "./keyboard.service";

describe("KeyboardService", () => {
  const keyboardService = new KeyboardService();

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
