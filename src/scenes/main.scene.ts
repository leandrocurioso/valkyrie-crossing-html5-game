export class MainScene extends Phaser.Scene {

  private backgroundMusic: Phaser.Sound.BaseSound;
  private collisionEffect: Phaser.Sound.BaseSound;
  private winningEffect: Phaser.Sound.BaseSound;
  private sconeText: Phaser.GameObjects.Text;
  private gameTitle: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Sprite;
  private player: Phaser.GameObjects.Sprite;
  private treasure: Phaser.GameObjects.Sprite;
  private enemies: Phaser.GameObjects.Group;
  private playerSpeed: number = 0;;
  private wins: number = 0;;
  private losses: number = 0;
  private enemySpeed = {
    min: 0,
    max: 0
  };
  private boundaries  = {
    enemyMinY: 0,
    enemyMaxY: 0
  };
  private playerRect: Phaser.Geom.Rectangle;
  private treasureRect: Phaser.Geom.Rectangle;
  private isTerminating: boolean = false;

  constructor() {
    super({
      key: "MainScene"
    });
  }
 
  private control(): void {
    if (this.input.activePointer.isDown) {
      this.backgroundMusic.resume();
      this.player.x += this.playerSpeed;
    }
  }

  private treasureCollision(): void {
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.playerRect, this.treasureRect)) {
      this.win();
      return;
    }
  }

  private moveEnemies(): void {
    Phaser.Actions.Call(this.enemies .getChildren(), (enemy: Phaser.GameObjects.Sprite) => {
      const enemySpped = enemy.getData("spped");
      enemy.y += enemySpped;
      const conditionUp = enemySpped < 0 && enemy.y <= this.boundaries.enemyMinY;
      const conditionDown = enemySpped > 0 && enemy.y >= this.boundaries.enemyMaxY;
      if (conditionUp || conditionDown) {
        enemy.setData("spped", (enemySpped * -1));
      }
    }, this);
  }

  private enemiesCollision(): void {
    Phaser.Actions.Call(this.enemies .getChildren(), (enemy: Phaser.GameObjects.Sprite) => {
      const enemyBounds = enemy.getBounds();
      if(Phaser.Geom.Intersects.RectangleToRectangle(this.playerRect, enemyBounds)) {
        this.gameOver();
        return;
      }
    }, this);
  }

  init(): void {
    this.playerSpeed = 3;
    this.enemySpeed.min = 1;
    this.enemySpeed.max = 4;
    this.boundaries.enemyMinY = 80;
    this.boundaries.enemyMaxY = 280;
    this.isTerminating = false;
  }

  preload(): void {
    // Audio
    this.load.audio("background", ["assets/audio/background.ogg", "assets/audio/background.mp3"]);
    this.load.audio("collision", ["assets/audio/collision.ogg", "assets/audio/collision.mp3"]);
    this.load.audio("winning", ["assets/audio/winning.ogg", "assets/audio/winning.mp3"]);

    // Graphic
    this.load.image("background", "./assets/image/background.png");
    this.load.image("player", "./assets/image/player.png");
    this.load.image("enemy", "./assets/image/dragon.png");
    this.load.image("treasure", "./assets/image/treasure.png");
  }

  create(): void {
    // Audio
    this.winningEffect = this.sound.add("winning");
    this.collisionEffect = this.sound.add("collision");
    this.backgroundMusic = this.sound.add("background", {
      loop: true
    });
    this.backgroundMusic.play();

    // Graphic
    const gameW = this.sys.game.config.width as number;
    const gameH = this.sys.game.config.height as number;
    const gameWM = gameW / 2;
    const gameHM = gameH / 2;
    this.background = this.add.sprite(gameWM, gameHM, "background");
    this.player = this.add.sprite(50, gameHM, "player");
    this.player.setScale(0.5);
    const groupConfig: GroupCreateConfig = {
      key: "enemy",
      repeat: 4,
      setXY: {
        x: 90, y: 100, stepX: 100, stepY: 20
      }
    };
    this.enemies = this.add.group(groupConfig);
    Phaser.Actions.ScaleXY(this.enemies .getChildren(), -0.4, -0.4);
    Phaser.Actions.Call(this.enemies .getChildren(), (enemy: Phaser.GameObjects.Sprite) => {
      enemy.flipX = true;

      const enemyDirection = ((Math.random() > 0.5) ? 1 : -1);
      const enemySpeed = this.enemySpeed.min + (Math.random() * (this.enemySpeed.max - this.enemySpeed.min));
      enemy.setData("spped", enemyDirection * enemySpeed);
    }, this);

    this.treasure = this.add.sprite(gameW - 80, gameHM, "treasure");
    this.treasure.setScale(0.6);
    this.treasureRect = this.treasure.getBounds();

    this.sconeText = this.add.text((gameW - 140) + 32, 32, `Wins: ${this.wins}\nLosses: ${this.losses}`, { 
        fontFamily: "Arial",
        fontSize: "18px",
        color: "yellow"
    });
    this.sconeText.setStroke("red", 3);
    this.gameTitle = this.add.text(gameWM - 100, gameH -44, `Valkyrie Crossing`, { 
      fontSize: "24px", 
      fill: "yellow"
    });
    this.gameTitle.setStroke("red", 5);

  }

  win() {
    this.wins += 1;
    this.isTerminating = true;
    this.winningEffect.play();
    this.cameras.main.flash(1000);
    this.cameras.main.on("cameraflashcomplete", (camera1, effect1) => {
      this.cameras.main.fadeOut(500);
    }, this);

    this.cameras.main.on("camerafadeoutcomplete", (camera2, effect2) => {
      this.collisionEffect.destroy();
      this.winningEffect.destroy();
      this.backgroundMusic.destroy();
      this.scene.restart();
      return;
    }, this);
  }

  gameOver() {
    this.losses += 1;
    this.isTerminating = true;
    this.collisionEffect.play();
    this.cameras.main.shake(500);
    this.cameras.main.on("camerashakecomplete", (camera1, effect1) => {
      this.cameras.main.fadeOut(500);
    }, this);

    this.cameras.main.on("camerafadeoutcomplete", (camera2, effect2) => {
      this.collisionEffect.destroy();
      this.winningEffect.destroy();
      this.backgroundMusic.destroy();
      this.scene.restart();
      return;
    }, this);
  }

  update(): void {
    if (this.isTerminating) { return; }
    this.playerRect = this.player.getBounds();
    this.control();
    this.treasureCollision();
    this.moveEnemies();
    this.enemiesCollision();
  }
}
