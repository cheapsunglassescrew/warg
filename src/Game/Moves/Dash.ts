namespace Moves {
  export class Dash extends GameObject {
    static readonly stateKey: string = "dash";
    
    private constructor(parent: IGameObject, id: string) {
      super(parent, id, ComponentFlags.None);
      this.tags |= GameObjectTags.Move;
    }

    static create(parent: IGameObject) {
      const dash = new Dash(parent, "dash" + Tools.unique());
      return dash;
    }

    onUpdate(tic: number): void {
      if (this.game.api.btnp(Button.B)) {
        if (Math.abs(this.parent.velocity.x) <= this.parent.defaultVelocity.x) {
          this.parent.velocity.x = 4 * this.parent.direction.x;
          this.parent.states[Dash.stateKey] = true;
        }
      }
      if (this.parent.states[Dash.stateKey] && this.parent.velocity.x <= this.parent.defaultVelocity.x && this.parent.velocity.x >= -this.parent.defaultVelocity.x) {
        this.parent.states[Dash.stateKey] = false;
      }
    }
  }
}