/**
* class ThrowableObject
* extends MovableObject
*/
class ThrowableObject extends MovableObject {
  imagesRotation = ImageHub.bottle.rotation;
  imagesSplash = ImageHub.bottle.splash;

  speedY;
  acceleration = 4;
  throwGroundY = 390;

  targetHit = false;
  splashed = false;

  offset = {top: 5, right: 5, bottom: 5, left: 5};

  constructor(x, y, direction) {
    super().loadImg("img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.loadImages(this.imagesRotation);
    this.loadImages(this.imagesSplash);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 40;

    this.direction = direction;
    this.otherDirection = direction === -1;

    this.runThrow();
    this.runAnimation();
  }

  /** Initializes the throw by setting speed and applying gravity. */
  runThrow() {
    this.speedY = 25;
    this.applyGravity();
    IntervalHub.startInterval(this.updateThrowState, 1000 / 60);
  }

  /** Updates the throw state each frame. */
  updateThrowState = () => {
    this.updateThrowPosition();
    this.checkGroundCollision(this.throwGroundY);
  };

  /** Updates the horizontal position of the throwable object. */
  updateThrowPosition() {
    if (!this.targetHit) {
      this.x += 10 * this.direction;
    }
  }

  /** Checks if the object has hit the ground. */
  checkGroundCollision(groundY) {
    if (this.y >= groundY && !this.targetHit) this.startSplash();
  }

  /** Starts the animation interval for the throwable object. */
  runAnimation() {
    IntervalHub.startInterval(this.updateAnimation, 1000 / 10);
  }

  /** Updates the current animation frame based on state. */
  updateAnimation = () => {
    if (this.shouldPlaySplash()) {
      this.playSplashAnimation();
      return;
    }
    if (this.shouldPlayRotation()) this.playRotationAnimation();
  };

  /** Returns true if splash animation should be played. */
  shouldPlaySplash() {
    return this.targetHit && !this.splashed;
  }

  /** Plays the splash animation. */
  playSplashAnimation() {
    this.playAnimation(this.imagesSplash);
  }

  /** Returns true if rotation animation should be played. */
  shouldPlayRotation() {
    return !this.targetHit;
  }

  /** Plays the rotation animation. */
  playRotationAnimation() {
    this.playAnimation(this.imagesRotation);
  }

  /** Handles splash logic when the bottle hits a target or ground. */
  startSplash() {
    this.markTargetHit();
    this.playSplashSound();
    this.scheduleSplashComplete();
  }

  /** Marks the throwable object as having hit a target. */
  markTargetHit() {
    this.targetHit = true;
  }

  /** Plays the bottle break sound. */
  playSplashSound() {
    AudioHub.playOne(AudioHub.bottleBreak);
  }

  /** Schedules completion of splash animation and removes object from world. */
  scheduleSplashComplete() {
    const splashDuration = (this.imagesSplash.length * 1000) / 20;
    setTimeout(() => {
      this.splashed = true;
      this.removeFromWorld();
    }, splashDuration);
  }

  /** Removes this throwable object from the world. */
  removeFromWorld() {
    if (this.world) {
      this.world.throwabelObjects = this.world.throwabelObjects.filter((b) => b !== this);
    }
  }
}