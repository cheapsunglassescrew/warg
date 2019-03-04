/// <reference path="./../../Framework/GameObject.ts" />

class Sword extends GameObject {
  private attackPhase: number = 0;
  private defaultPosition: Vector2 = Vector2.zero;
  private hitByThisSwing: IGameObject[] = [];

  private constructor(parent: IGameObject, id: string) {
    super(parent, id, ComponentFlags.Visible | ComponentFlags.Actor);
    this.tags |= GameObjectTags.Weapon;
  }
  onUpdate(): void {
    let directionOffset = 0;
    if (this.parent.direction.x < 0) {
      directionOffset = this.parent.dimensions.x - this.dimensions.x;
    }

    if (this.attackPhase == 0) {
      this.position.x = this.defaultPosition.x + directionOffset;
      if (this.game.api.btnp(Button.X)) {
        this.attackPhase += 1;
      }
    }
    if (this.attackPhase == 1) {
      if (Math.abs(this.position.x) < 9) {
        this.position.x += 3 * this.parent.direction.x;
      } else {
        this.attackPhase += 1;
      }
    } else if (this.attackPhase == 2) {
      this.position.x += -2 * this.parent.direction.x;
      if ((this.parent.direction.x > 0 && this.position.x < this.defaultPosition.x)
        || (this.parent.direction.x < 0 && this.position.x > this.defaultPosition.x + directionOffset )) {
        this.position.x = this.defaultPosition.x + directionOffset;
        this.attackPhase = 0;
        this.hitByThisSwing = [];
      }
    }
    if (this.attackPhase != 0) {
      const collidingObject = this.components.actor.getFirstObjectCollision(GameObjectTags.Enemy);
      if (collidingObject != null) {
        if (this.hitByThisSwing.indexOf(collidingObject) < 0) {
          this.hitByThisSwing.push(collidingObject);
          collidingObject.onHit(this);
          if (collidingObject.components.actor.isDead()) {
            this.parent.score += collidingObject.components.actor.scoreValue;
          }
        }
      }
    }
  }

  static create(parent: IGameObject): Sword {
    const sword = new Sword(parent, "sword" + Tools.unique());
    sword.dimensions = new Vector2(8, 2);
    sword.defaultPosition = new Vector2(0, 3);
    sword.position = sword.defaultPosition.copy();
    sword.components.visible.color = 4;
    return sword;
  }
}