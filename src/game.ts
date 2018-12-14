/// <reference path="../phaser.d.ts"/>

import "phaser";
import { MainScene } from "./scenes/main.scene";

// main game configuration
const config: GameConfig = {
  width: 640,
  height: 360,
  type: Phaser.AUTO,
  parent: "game",
  scene: [
    MainScene
  ],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  }
};

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  var game = new Game(config);
};
