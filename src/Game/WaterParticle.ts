/// <reference path="./../rosetic/src/GameObject.ts" />

class WaterParticle extends GameObject {
  liveCounter: number = 20;
  constructor(parent: IGameObject, id: string) {
    super(parent, id, ComponentFlags.Visible | ComponentFlags.Solid);
    this.dimensions = new Vector2(2, 2);
    this.components.visible.color = 9;
  }
  onUpdate(tic: number) {
    this.velocity.y = this.velocity.y + this.game.gravity;
    if (this.components.solid.grounded) {
      this.velocity.x = 0;
      this.liveCounter--;
    }
    if (this.liveCounter <= 0) {
      this.destroy();
    }
  }
  static create(parent: IGameObject, startVelocity: Vector2): WaterParticle {
    const waterParticle = new WaterParticle(parent, "WaterParticle" + Tools.unique());
    waterParticle.velocity = startVelocity.copy();
    return waterParticle;
  }
}