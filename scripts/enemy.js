class Enemy {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.radius = 40;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.speedX = 0;
    this.speedY = 0;
    this.angle = 0;
    this.isFree = true;
  }
  startEnemy() {
    this.isFree = false;
    this.frameX = 0;
    this.lives = this.maxLives;
    this.frameY = Math.floor(Math.random() * 4);
    if (Math.random() < 0.5) {
      this.x = Math.random() * this.game.width;
      this.y =
        Math.random() < 0.5 ? -this.radius : this.game.height + this.radius;
    } else {
      this.x =
        Math.random() < 0.5 ? -this.radius : this.game.width + this.radius;
      this.y = Math.random() * this.game.height;
    }
    const aim = this.game.calculateAim(this, this.game.planet);
    this.speedX = aim[0];
    this.speedY = aim[1];
    this.angle = Math.atan2(aim[3], aim[2]) + Math.PI * 0.5;
  }
  resetEnemy() {
    this.isFree = true;
  }
  update() {
    if (!this.isFree) {
      this.x += this.speedX;
      this.y += this.speedY;
      // collision between enemy and planet
      if (this.game.checkCollision(this, this.game.planet)) {
        this.lives = 0;
        this.speedX = 0;
        this.speedY = 0;
        // this.resetEnemy(); => deprecated
      }
      // collsion between enemy and player
      if (this.game.checkCollision(this, this.game.player)) {
        // this.resetEnemy() => deprecated
        this.lives = 0;
      }
      // collision between enemy and projectiles
      this.game.projectilePool.forEach((projectile) => {
        if (
          !projectile.isFree &&
          this.game.checkCollision(this, projectile) &&
          this.lives >= 1
        ) {
          projectile.resetProjectile();
          this.hit(1);
        }
      });
      // sprite animation
      if (this.lives < 1 && this.game.spriteUpdate) {
        this.frameX++;
      }
      // where enemy reset is done
      if (this.frameX > this.maxFrame) {
        this.resetEnemy();
      }
    }
  }
  draw(context) {
    if (!this.isFree) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        -this.radius,
        -this.radius,
        this.width,
        this.height
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(0, 0, this.radius, Math.PI * 2);
        context.stroke();
        context.fillText(this.lives, 0, 0);
      }
      context.restore();
    }
  }
  hit(damage) {
    this.lives -= damage;
    if (this.lives >= 1) this.frameX++;
  }
}

export class Asteroid extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("asteroid");
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
    this.maxFrame = 7;
    this.lives = 1;
    this.maxLives = this.lives;
  }
}

export class Lobstermorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("lobstermorph");
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
    this.maxFrame = 14;
    this.lives = 8;
    this.maxLives = this.lives;
  }
}
