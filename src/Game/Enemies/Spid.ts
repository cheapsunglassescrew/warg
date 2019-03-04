/// <reference path="./../../Framework/GameObject.ts" />

namespace Enemies {
  export class Spid extends GameObject {
    static readonly spidsCollectionId: string = "spids"; 
    private jumpSpeed: number = -2;
    private blockedFromAbove = false;
    private blockedFromBottom = false;
    canJumpOnOtherSpid: boolean = false;
    hasSpidAbove: boolean = false;
    blockedHorizontally: boolean = false;
    freezeCounter: number = 0;
    defaultFreezeCounter: number = 0;
    killerPosition: Vector2;

    private get _spids() : IGameObject[] {
      return this.game.getGameObjectCollection(Spid.spidsCollectionId);
    }
    
    target: IGameObject;
    killerVelocity: Vector2 = null;
    constructor(parent: IGameObject, id: string, target: IGameObject) {
      super(parent, id, ComponentFlags.Visible | ComponentFlags.Solid | ComponentFlags.Actor);
      this.target = target;
      this.tags |= GameObjectTags.Enemy;

    }
    onUpdate(): void {
      
      if (this.freezeCounter > 0) {
        this.freezeCounter--;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.components.visible.color = 15;
        return;
      }
      this.components.visible.color = this.components.visible.defaultColor;

      const stoppedAtFrameStart = (this.velocity.x == 0 && this.velocity.y == 0);

      this.velocity.y = this.velocity.y + this.game.gravity;

      if (this.velocity.x > this.defaultVelocity.x) {
        this.velocity.x -= 0.2;
      }
      else if (this.velocity.x < -this.defaultVelocity.x) {
        this.velocity.x += 0.2;
      }
      if (Math.abs(this.velocity.x) <= this.defaultVelocity.x) {
        if (this.position.x >= this.target.position.x + this.target.dimensions.x) {
          this.velocity.x = -this.defaultVelocity.x;
        }
        else if (this.position.x + this.dimensions.x - 1 <= this.target.position.x) {
          this.velocity.x = this.defaultVelocity.x;
        }
      }

      if ((stoppedAtFrameStart && this.components.solid.grounded && !this.hasSpidAbove)
        || (stoppedAtFrameStart && this.canJumpOnOtherSpid && !this.hasSpidAbove)) {
        this.velocity.y = this.jumpSpeed;
      }

      this.blockedFromAbove = false;
      this.blockedFromBottom = false;
      this.canJumpOnOtherSpid = false;
      this.hasSpidAbove = false;
      this.blockedHorizontally = false;
      let blocked = false;
      

      for (let i = 0; i < this._spids.length; i++) {
        const otherSpid = this._spids[i];
        if (this != otherSpid) {
          const overlapsXAxis = BoundingBoxCollider.overlapsXAxis(this.position, this.velocity, this.dimensions, otherSpid.position, otherSpid.dimensions);
          const overlapsYAxis = BoundingBoxCollider.overlapsYAxis(this.position, this.velocity, this.dimensions, otherSpid.position, otherSpid.dimensions);
          if (this.position.y > otherSpid.position.y && overlapsXAxis) {
            this.hasSpidAbove = true;
          }
          if (overlapsXAxis && overlapsYAxis) {
            if (this.position.y > otherSpid.position.y) {
              this.blockedFromAbove = true;
            }
            if (this.position.y < otherSpid.position.y) {
              this.blockedFromBottom = true;
              if (otherSpid.velocity.y == 0) {
                this.canJumpOnOtherSpid = true;
              }
            }
            blocked = true;
          }
        }
      }
      if (blocked) {
        this.velocity.x = 0;
      }
      if ((this.blockedFromAbove && this.velocity.y < 0)
        || (this.blockedFromBottom && this.velocity.y > 0)) {
        this.velocity.y = 0;
      }

    }

    onHit(hitter: IGameObject): void {
      this.components.actor.hitPoints -= 1;
      this.freezeCounter = this.defaultFreezeCounter;
      if (this.components.actor.isDead()) {
        this.killerVelocity = hitter.velocity.copy();
        this.killerPosition = hitter.position.copy();
      }
    }
    onDestroy() {
      this.spawnParticlesOfDeath();
      for (let i = 0; i < this._spids.length; i++) {
        const selectedSpid = this._spids[i];
        if (this == selectedSpid) {
          this._spids.splice(i, 1);
        }
      }
    }
    private spawnParticlesOfDeath(): any {
      for (let i = 0; i < 3; i++) {
        let bloodParticle = new BloodParticle(this.game.root, "bloodParticle" + Tools.unique());
        bloodParticle.position = this.position.copy();
        let xVelocity;
        if (this.killerVelocity.x != 0) {
          xVelocity = this.killerVelocity.x;
        } else {
          if (this.killerPosition > this.position) {
            xVelocity = 0.5 + (1 * (i * 0.5));
          } else {
            xVelocity = -0.5 + (-1 * (i * 0.5));
          }
        }
        let yVelocity = -i - 1;
        bloodParticle.velocity = new Vector2(xVelocity, yVelocity);
      }
    }
    static create(parent: IGameObject, startVelocity: Vector2): Spid {
      let spid = new Enemies.Spid(parent, "spid" + Tools.unique(), parent.game.player);
      spid.dimensions = new Vector2(4, 4);
      spid.defaultVelocity = new Vector2(0.4, 0);
      spid.velocity = startVelocity;
      spid.components.actor.hitPoints = 2;
      spid.defaultFreezeCounter = 10;
      spid.jumpSpeed = -1.7;
      spid.components.visible.defaultColor = Tools.getRandomInt(10,12);
      spid.components.visible.color = spid.components.visible.defaultColor;
      parent.game.getGameObjectCollection(Spid.spidsCollectionId).push(spid);
      return spid;
    }
  }
}