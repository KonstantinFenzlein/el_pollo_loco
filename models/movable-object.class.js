/**
* class MovableObject
* extends DrawableObject
*/
class MovableObject extends DrawableObject {
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  bottleCount = 0;
  coinCount = 0;
  lastMove = Date.now();

  currentJump = 0;

  /** Starts animation for enemies. */
  startEnemiesRun() {
    this.animate();
  }

  /**
  * Plays animation by cycling through an array of images.
  * @param {string[]} images - Array of image paths.
  */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /** Applies gravity to the object over time. */
  applyGravity() {
    setInterval(() => {
    if (this.splashed || this.targetHit) {
      return;
    }
    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
     }
    }, 1000 / 25);
  }

  /** Determines if the object is above ground. */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    }
    return this.y < 130;
  }

  /** Reduces energy when hit and plays damage sound. */
  hit() {
    this.energy -= 0.5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
    AudioHub.playOne(AudioHub.characterDamage);
  }

  /** Reduces boss energy when hit and temporarily sets isHurt. */
  hitBoss() {
    if (this.isHurt || this.dead) return;
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
    this.isHurt = true;
    setTimeout(() => {
      this.isHurt = false;
    }, 400);
  }

  /** Returns true if the object was hit within the last second. */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /** Returns true if the object is dead (energy is 0). */
  isDead() {
    return this.energy == 0;
  }

  /** Collects a bottle and plays collection sound. */
  collect() {
    AudioHub.playOne(AudioHub.bottleCollectSound);
    this.bottleCount++;
    if (this.bottleCount >= 10) {
      this.bottleCount = 10;
    }
  }

  /** Collects a coin and plays collection sound. */
  collectCoin() {
    AudioHub.playOne(AudioHub.coinCollectSound);
    this.coinCount++;
    if (this.coinCount >= 10) {
      this.coinCount = 10;
    }
  }

  /** Moves the object to the right. */
  moveRight() {
    this.x += this.speed;
    this.lastMove = Date.now();
  }

  /** Moves the object to the left. */
  moveLeft() {
    this.x -= this.speed;
    this.lastMove = Date.now();
  }

 /** Makes the object jump by setting vertical speed. */
 jump() {
    this.speedY = 30;
    this.lastMove = Date.now();
  }

  /** Returns true if the object has been idle for more than 10 seconds. */
  isSleeping() {
    return Date.now() - this.lastMove > 10000;
  }

  /** Handles object death and plays random death sound. */
  die() {
    if (this.dead || this.isDying) return;
    this.isDying = true;
    const sound = Math.random() < 0.5 ? AudioHub.chickenDead : AudioHub.chickenDead2;
    AudioHub.playOne(sound);
    setTimeout(() => {
      this.dead = true;
    }, 1000);
  }
}