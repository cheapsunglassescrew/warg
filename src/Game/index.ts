let __tic = 0;
let __game: Game;
let __realTic = 0;
let __slowMo = false;

function TIC(): void {
  if (__tic == 0) {
    __game = new Game(new Tic80Api());
    __game.init();
  }
  if (__game.api.key(48)) {
    __slowMo = !__slowMo;
  }
  if (__slowMo) {
    if (__realTic % 15 == 0) {
      __game.update(__tic);
      __tic++;
    }
  } else {
    __game.update(__tic);
    __tic++;
  }
  __realTic++;
}