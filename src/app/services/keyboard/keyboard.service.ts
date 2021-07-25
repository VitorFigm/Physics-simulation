import { Observable } from "@app/utils";

export class KeyboardService {
  keydown$ = new Observable<string>(({ next }) => {
    addEventListener("keydown", (event) => {
      next(event.key);
    });
  });

  keyup$ = new Observable<string>(({ next }) => {
    addEventListener("keyup", (event) => {
      next(event.key);
    });
  });

  listenKeyDown(key: string) {
    return this.keydown$.filter((value) => value === key);
  }

  listenKeyUp(key: string) {
    return this.keyup$.filter((value) => value === key);
  }
}
