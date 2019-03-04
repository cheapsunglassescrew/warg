/// <reference path="./../rosetic/Framework/GameObject.ts" />

class BloodParticle extends GameObject {
  liveCounter: number = 50;
  constructor(parent: IGameObject, id: string) {
    super(parent, id, ComponentFlags.Visible | ComponentFlags.Solid);
    this.dimensions = new Vector2(2, 2);
    this.components.visible.color = Tools.getRandomInt(10,12);
  }
  onUpdate(tic: number) {
    this.liveCounter -= 1;
    if (this.liveCounter <= 0) {
      this.destroy();
    }
    this.velocity.y = this.velocity.y + this.game.gravity;
    if (this.components.solid.grounded && Math.abs(this.velocity.x) > 0) {
      if (Math.abs(this.velocity.x) < 0.1) {
        this.velocity.x = 0;
      } else {
        this.velocity.x = (Math.abs(this.velocity.x) - 0.1) * Tools.normalize(this.velocity.x);
      }      
    }
  }
}