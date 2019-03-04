/// <reference path="./../../Framework/Level.ts" />

class GameTitle extends Level {
  update(tic: number): void {
    this.game.api.cls();
    this.game.api.print("WARG", 5, 10, 10, false, 10); 
    Tools.printCentered(this.game.api, "by Cheap Sunglasses Crew", undefined, 150, 13, false, 1.5); 
    Tools.printCentered(this.game.api, "Press X button/A key", undefined, 230, 13); 
    if (this.game.api.btnp(Button.X)) {
      this.game.setCurrentLevel(new GameStart(this.game));
    }
  }
}