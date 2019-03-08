/// <reference path="./../rosetic/src/GameObject.ts" />

class Player extends GameObject {  

  hurtTimer: number = 0;
  hurtTimerValue: number = 0;
  hurtJumpVector: Vector2 = Vector2.zero;

  private constructor(parent: IGameObject, id: string) {
    super(parent, id, ComponentFlags.Visible | ComponentFlags.Solid | ComponentFlags.Actor);
    this.tags |= GameObjectTags.Player;
  }
  onDestroy() {
    this.game.setCurrentScene(new GameOver(this.game));
    if (this.game.hiScore < this.score) {
      this.game.hiScore = this.score;
    }
  }
  onCollision(collidingObject: IGameObject): void {
    if (this.hurtTimer == 0) {
      this.velocity.x = collidingObject.velocity.x > 0 ? this.hurtJumpVector.x : -this.hurtJumpVector.x;
      this.velocity.y = this.hurtJumpVector.y;
      this.components.actor.hitPoints -= 1;
      this.hurtTimer = this.hurtTimerValue;
    }
  }
  onUpdate(tic: number): void {
    this.velocity.y = this.velocity.y + this.game.gravity;
    if (this.hurtTimer > 0) {
      this.hurtTimer -= 1;
    }
    const collidingObject = this.components.actor.getFirstObjectCollision(GameObjectTags.Enemy);
    if (collidingObject != null) {
      if (this.states[Moves.Dash.stateKey]) {
        collidingObject.onCollision(this);
        if (collidingObject.components.actor.isDead()) {
          this.score += collidingObject.components.actor.scoreValue;
        }
      } else {
        this.onCollision(collidingObject);
      }
    }
    if (this.velocity.x <= this.defaultVelocity.x && this.velocity.x >= -this.defaultVelocity.x) {
      if (this.game.api.btn(Button.Left)) {
        this.velocity.x = -this.defaultVelocity.x;
      }
      else if (this.game.api.btn(Button.Right)) {
        this.velocity.x = this.defaultVelocity.x;
      }
      else {
        this.velocity.x = 0;
      }
    }
    if (this.components.solid.grounded && this.game.api.btnp(Button.A)) {
      this.velocity.y = -2.7;
    }
    if (this.velocity.x > this.defaultVelocity.x) {
      this.velocity.x -= 0.2;
    }
    else if (this.velocity.x < -this.defaultVelocity.x) {
      this.velocity.x += 0.2;
    }

    this.components.visible.color = 13;
    if (this.hurtTimer > 0) {
      this.components.visible.color = 15;
      if (tic % 4 == 1) {
        this.components.visible.hide = !this.components.visible.hide;
      }
    } else if (this.states[Moves.Dash.stateKey]) {
      this.components.visible.color = 14;
      if (tic % 4 == 1) {
        this.components.visible.hide = !this.components.visible.hide;
      }
    }
    else {
      this.components.visible.hide = false;
    }
  }

  static create(parent: IGameObject): Player {
    const player = new Player(parent, "player" + Tools.unique());
    player.position = new Vector2(115, 70);
    player.components.visible.color = 15;
    player.dimensions = new Vector2(6, 8);
    player.defaultVelocity = new Vector2(1, 0);
    player.components.actor.hitPoints = 5;
    player.hurtTimerValue = 30;
    player.hurtJumpVector = new Vector2(2, -2);


    Moves.Dash.create(player);

    return player;
  }
}