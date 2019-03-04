/// <reference path="./../../Framework/Level.ts" />

class GameStart extends Level {
  update(tic: number): void {
    this.game.api.cls();
    Tools.printCentered(this.game.api, "WARG", undefined, 40, 10, false, 3); 
    Tools.printCentered(this.game.api, "A button/Z key : Jump", undefined, 110, 13); 
    Tools.printCentered(this.game.api, "B button/X key : Dash", undefined, 130, 13); 
    Tools.printCentered(this.game.api, "X button/A key : Weapon", undefined, 150, 13); 
    Tools.printCentered(this.game.api, "D Pad/Arrows : Movement", undefined, 170, 13); 
    Tools.printCentered(this.game.api, "Press X button/A key", undefined, 230, 13); 
    if (this.game.api.btnp(Button.X)) {
      this.game.setCurrentLevel(new Sewers(this.game));
    }
  }
}