/// <reference path="../../rosetic/src/Scene.ts" />

class GameOver extends Scene {
  update(tic: number): void {
    Tools.printCentered(this.game.api, "GAME OVER", undefined, undefined, 13);
    Tools.printCentered(this.game.api, "Press X button/A key", undefined, 230, 13); 
    if (this.game.api.btnp(Button.X)) {
      this.game.setCurrentScene(new GameStart(this.game));
    }
  }
}