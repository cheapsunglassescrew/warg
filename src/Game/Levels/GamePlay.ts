/// <reference path="./../../rosetic/src/Level.ts" />

abstract class GamePlay extends Scene {
  update(tic: number): void {
    this.game.root.update(tic);
    this.game.api.cls();
    this.renderMap();
    this.game.root.draw();
    this.renderUI();
  }
  renderMap(): void {
    this.game.api.map(this.game.mapOffset.x, this.game.mapOffset.y);
  }
  renderUI(): void {
    for (let i = 0; i < this.game.player.components.actor.hitPoints; i++) {
      this.game.api.print("*", i * 8, 0, 13);
    }
    Tools.printRight(this.game.api, "SCORE: " + this.game.player.score.toString(), 240, 0, 13);
    Tools.printCentered(this.game.api, "HI-SCORE: " + this.game.hiScore.toString(), undefined, 0,13); 
  }
}