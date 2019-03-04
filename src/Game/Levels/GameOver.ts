/// <reference path="./../../rosetic/Framework/Level.ts" />

class GameOver extends Level {
  update(tic: number): void {
    Tools.printCentered(this.game.api, "GAME OVER", undefined, undefined, 13);
    Tools.printCentered(this.game.api, "Press X button/A key", undefined, 230, 13); 
    if (this.game.api.btnp(Button.X)) {
      this.game.setCurrentLevel(new GameStart(this.game));
    }
  }
}