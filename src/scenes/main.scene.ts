export class MainScene extends Phaser.Scene {

  private background: Phaser.GameObjects.Sprite;
  private player: Phaser.GameObjects.Sprite;
  private enemy1: Phaser.GameObjects.Sprite;
  private treasure: Phaser.GameObjects.Sprite;
  private playerSpeed: number = 0;;
  private enemySpeed: number = 0;;
  private boundaries  = {
    enemyMinY: 80,
    enemyMaxY: 280
  };

  constructor() {
    super({
      key: "MainScene"
    });
  }
 
  private control(): void {
    if (this.input.activePointer.isDown) {
      this.player.x += this.playerSpeed;
    }
  }

  private collision(): void {
    const playerRect = this.player.getBounds();
    const treasureRect = this.treasure.getBounds();

    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
      this.scene.restart();
      return;
    }
  }

  private moveEnemy(): void {
    this.enemy1.y += this.enemySpeed;
    const conditionUp = this.enemySpeed < 0 && this.enemy1.y <= this.boundaries.enemyMinY;
    const conditionDown = this.enemySpeed > 0 && this.enemy1.y >= this.boundaries.enemyMaxY;
    if (conditionUp || conditionDown) {
      this.enemySpeed *= -1;
    }
  }

  init(): void {
    this.playerSpeed = 3;
    this.enemySpeed = 3;
  }

  preload(): void {
    this.load.image("background", "./assets/background.png");
    this.load.image("player", "./assets/player.png");
    this.load.image("enemy", "./assets/dragon.png");
    this.load.image("treasure", "./assets/treasure.png");
  }

  create(): void {

    const gameW = this.sys.game.config.width as number;
    const gameH = this.sys.game.config.height as number;
    const gameWM = gameW / 2;
    const gameHM = gameH / 2;

    this.background = this.add.sprite(gameWM, gameHM, "background");
    this.player = this.add.sprite(50, gameHM, "player");
    this.player.setScale(0.5);
    this.enemy1 = this.add.sprite(120, gameHM, "enemy");
    this.enemy1.setScale(0.6);
    this.enemy1.flipX = true;
    this.treasure = this.add.sprite(gameW - 80, gameHM, "treasure");
    this.treasure.setScale(0.6);
  }

  update(): void {
    this.control();
    this.collision();
    this.moveEnemy();
  }
}
