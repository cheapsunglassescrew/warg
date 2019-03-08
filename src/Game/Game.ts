/// <reference path="./../rosetic/src/BaseGame.ts" />

class Game extends BaseGame {
  readonly solidTiles: number[] = [3, 4, 5,6, 19, 22, 35, 38, 51, 54];
  init(): void {
    this.setCurrentScene(new GameTitle(this));
  }
}