export default class Projectile {
  constructor(game) {
    this.game = game;
    this.isFree = true;
    this.x;
    this.y;
    this.radius = 4;
    this.speedX = 1;
    this.speedY = 1;
    this.speedModifier = 5;
  }
  update() {
    if (!this.isFree) {
      this.x += this.speedX * this.speedModifier;
      this.y += this.speedY * this.speedModifier;
    }
    // reset if outside visible game area
    if (
      this.x < 0 ||
      this.y < 0 ||
      this.x > this.game.width ||
      this.y > this.game.height
    ) {
      this.resetProjectile();
    }
  }
  draw(context) {
    if (!this.isFree) {
      context.save();
      context.fillStyle = "yellow";
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }
  startProjectile(x, y, speedX, speedY) {
    this.isFree = false;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
  }
  resetProjectile() {
    this.isFree = true;
  }
}
