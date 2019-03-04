/// <reference path="./../Game/Game.ts" />
/// <reference path="./DebugApi.ts" />

let ticDebug = 0;
let game: Game;
function debug(): void {  

  if (ticDebug == 0) {
    game = new Game(new DebugApi());
    game.init();
  }

  game.update(ticDebug);

  ticDebug++;
}

do {
  debug();
} while (true);
