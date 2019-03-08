class Sewers extends GamePlay {
  leftSpawnSpid: SpawnBox;
  rightSpawnSpid: SpawnBox;
  topSpawnSpid: SpawnBox;

  phase: number = 0;
  phaseDurationCounter: number = 0;
  delayCounter: number = 0;
  delayedPhase: number = 0;
  leftSpawnWater: SpawnBox;
  rightSpawnWater: SpawnBox;
  topSpawnWater: SpawnBox;

  init() {
    super.init();

    this.game.initializeGameObjectCollections();

    this.game.root.reset();
    this.game.player = Player.create(this.game.root);
    this.game.player.position = new Vector2(115, 70);
    Sword.create(this.game.player);

    const waterMinRandomStart = new Vector2(0.5, 0);
    const waterMaxRandomStart = new Vector2(1.7, 0);
    const waterSpawnProbability = 0.4;

    const spidCount = 10;

    this.leftSpawnSpid = new SpawnBox(this.game.root, "LeftSpawnSpid", Enemies.Spid.create, spidCount, 7, 0.6);
    this.leftSpawnSpid.position = new Vector2(12, 80);
    this.leftSpawnSpid.dimensions = new Vector2(1, 2);
    this.leftSpawnSpid.minRandomStartVelocity = new Vector2(1.8, 0);
    this.leftSpawnSpid.maxRandomStartVelocity = new Vector2(2.5, 0);
    this.leftSpawnSpid.count = this.leftSpawnSpid.maxCount;

    this.leftSpawnWater = new SpawnBox(this.game.root, "leftSpawnWater", WaterParticle.create, 50, 2, waterSpawnProbability);
    this.leftSpawnWater.position = new Vector2(12, 80);
    this.leftSpawnWater.dimensions = new Vector2(1, 2);
    this.leftSpawnWater.minRandomStartVelocity = waterMinRandomStart;
    this.leftSpawnWater.maxRandomStartVelocity = waterMaxRandomStart;
    this.leftSpawnWater.count = this.leftSpawnWater.maxCount;

    this.rightSpawnSpid = new SpawnBox(this.game.root, "RightSpawnSpid", Enemies.Spid.create, spidCount, 7, 0.6);
    this.rightSpawnSpid.position = new Vector2(227, 80);
    this.rightSpawnSpid.dimensions = new Vector2(1, 2);
    this.rightSpawnSpid.minRandomStartVelocity = new Vector2(-1.8, 0);
    this.rightSpawnSpid.maxRandomStartVelocity = new Vector2(-2.5, 0);
    this.rightSpawnSpid.count = this.rightSpawnSpid.maxCount;

    this.rightSpawnWater = new SpawnBox(this.game.root, "rightSpawnWater", WaterParticle.create, 50, 2, waterSpawnProbability);
    this.rightSpawnWater.position = new Vector2(227, 80);
    this.rightSpawnWater.dimensions = new Vector2(1, 2);
    this.rightSpawnWater.minRandomStartVelocity = new Vector2(-waterMinRandomStart.x, waterMinRandomStart.y);
    this.rightSpawnWater.maxRandomStartVelocity = new Vector2(-waterMaxRandomStart.x, waterMaxRandomStart.y);
    this.rightSpawnWater.count = this.rightSpawnWater.maxCount;

    this.topSpawnSpid = new SpawnBox(this.game.root, "TopSpawnSpid", Enemies.Spid.create, spidCount, 7, 0.6);
    this.topSpawnSpid.position = new Vector2(110, 46);
    this.topSpawnSpid.dimensions = new Vector2(20, 2);
    this.topSpawnSpid.startVelocity = new Vector2(0, 0);
    this.topSpawnSpid.count = this.topSpawnSpid.maxCount;

    this.topSpawnWater = new SpawnBox(this.game.root, "topSpawnWater", WaterParticle.create, 220, 0, 1);
    this.topSpawnWater.position = new Vector2(110, 48);
    this.topSpawnWater.dimensions = new Vector2(20, 2);
    this.topSpawnWater.startVelocity = new Vector2(0, 0);
    this.topSpawnWater.count = this.topSpawnWater.maxCount;

    this.game.mapOffset = new Vector2(0, 0);
    this.game.gravity = 0.2;

    this.phase = 0;
    this.delayCounter = 60;
    this.delayedPhase = 1;
  }
  update(tic: number): void {
    this.phaseDurationCounter++;

    if (this.phase == 0) {
      if (this.phaseDurationCounter == this.delayCounter) {
        this.setPhase(this.delayedPhase);
      }
    } else if (this.phase == 1) {
      const randomPhase = Tools.getRandomInt(2, 4);
      this.setPhase(randomPhase);
    } else if (this.phase == 2) {
      this.leftSpawnWater.count = 0;
      this.setPhase(5, 220);
    } else if (this.phase == 3) {
      this.rightSpawnWater.count = 0;
      this.setPhase(6, 220);
    } else if (this.phase == 4) {
      this.topSpawnWater.count = 0;
      this.setPhase(7, 220);
    } else if (this.phase == 5) {
      this.leftSpawnSpid.count = 0;
      this.setPhase(1, 220);
    } else if (this.phase == 6) {
      this.rightSpawnSpid.count = 0;
      this.setPhase(1, 220);
    } else if (this.phase == 7) {
      this.topSpawnSpid.count = 0;
      this.setPhase(1, 220);
    }

    super.update(tic);
  }
  setPhase(phase: number, delayCounter: number = 0) {
    if (delayCounter == 0) {
      this.phase = phase;
    } else {
      this.phase = 0;
      this.delayCounter = delayCounter;
      this.delayedPhase = phase;
    }
    this.phaseDurationCounter = 0;
  }
}