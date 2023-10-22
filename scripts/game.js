import Planet from "./planet.js";
import Player from "./player.js";
import Projectile from "./projectile.js";
import { Lobstermorph } from "./enemy.js";
import { Asteroid } from "./enemy.js";

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.planet = new Planet(this);
    this.player = new Player(this);
    this.debug = false;

    this.projectilePool = [];
    this.numberOfProjectiles = 30;
    this.createProjectilePool();

    this.enemyPool = [];
    this.numberOfEnemies = 20;
    this.createEnemies();
    this.enemyPool[0].startEnemy();
    this.enemyTimer = 0;
    this.enemyInterval = 1800;

    this.spriteUpdate = false;
    this.spriteTimer = 0;
    this.spriteInterval = 150;

    this.controllerIndex = null;
    this.buttonPressed = false;

    this.mouse = {
      x: 0,
      y: 0,
    };

    // event listeners
    window.addEventListener("gamepadconnected", (e) => {
      this.controllerIndex = e.gamepad.index;
      console.log("Connected");
    });
    window.addEventListener("gamepaddisconnected", () => {
      this.controllerIndex = null;
      console.log("Disconnected");
    });
    window.addEventListener("mousemove", (e) => {
      // Offset accounts for the white spaces around the canvas
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });
    window.addEventListener("mousedown", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.player.shoot();
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "d") this.debug = !this.debug;
      if (e.key === " ") this.player.shoot();
    });
  }
  gamepadListener() {
    if (this.controllerIndex !== null) {
      const gamepad = navigator.getGamepads()[this.controllerIndex];
      if (gamepad.buttons[0].pressed && !this.buttonPressed) {
        this.buttonPressed = true;
        this.player.shoot();
      }
      if (!gamepad.buttons[0].pressed) this.buttonPressed = false;
    }
  }
  render(context, deltaTime) {
    this.gamepadListener();
    this.planet.draw(context);
    this.player.draw(context);
    this.player.update(this.gamepadX, this.gamepadY);
    this.projectilePool.forEach((projectile) => {
      projectile.update();
      projectile.draw(context);
    });
    this.enemyPool.forEach((enemy) => {
      enemy.update();
      enemy.draw(context);
    });
    // Periodically activate enemy from the object pool every 1 second
    if (this.enemyTimer < this.enemyInterval) {
      this.enemyTimer += deltaTime;
    } else {
      this.enemyTimer = 0;
      const enemy = this.getEnemy();
      if (enemy) {
        enemy.startEnemy();
      }
    }
    if (this.spriteTimer < this.spriteInterval) {
      this.spriteTimer += deltaTime;
      this.spriteUpdate = false;
    } else {
      this.spriteTimer = 0;
      this.spriteUpdate = true;
    }
  }
  checkCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.hypot(dx, dy);
    const sumOfRadii = a.radius + b.radius;
    return distance < sumOfRadii;
  }
  // calculated direction between object a and b
  calculateAim(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.hypot(dx, dy);
    const aimX = (dx / distance) * -1;
    const aimY = (dy / distance) * -1;
    return [aimX, aimY, dx, dy];
  }
  createProjectilePool() {
    for (let i = 0; i < this.numberOfProjectiles; i++) {
      this.projectilePool.push(new Projectile(this));
    }
  }
  getProjectile() {
    for (let i = 0; i < this.numberOfProjectiles; i++) {
      if (this.projectilePool[i].isFree) return this.projectilePool[i];
    }
  }
  createEnemies() {
    for (let i = 0; i < this.numberOfEnemies; i++) {
      let random = Math.random();
      if (random < 0.5) this.enemyPool.push(new Asteroid(this));
      else this.enemyPool.push(new Lobstermorph(this));
    }
  }
  getEnemy() {
    for (let i = 0; i < this.numberOfEnemies; i++) {
      if (this.enemyPool[i].isFree) return this.enemyPool[i];
    }
  }
}
