/**
* Represents the final boss in the game.
* Handles specialized movement, attack patterns like dashing, and state-based animations.
* @extends MovableObject
*/
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  x = 2000;

  imagesWalking = ImageHub.endboss.walking;
  imagesAlert = ImageHub.endboss.alert;
  imagesAttack = ImageHub.endboss.attack;
  imagesHurt = ImageHub.endboss.hurt;
  imagesDead = ImageHub.endboss.dead;

  dead = false;
  isDying = false;
  isHurt = false;
  isActive = false;
  isAttacking = false;

  dashThresholds = [80, 50, 20];
  isBaiting = false;
  isDashing = false;

  activationX = 1500;
  deathSoundPlayed = false;
  idleSoundPlaying = false;
  endbossSoundPlaying = false;

  speed = 0;
  attackSpeed = 0;
  enrageSpeed = 0;

  constructor() {
    super().loadImg("img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png");

    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesDead);
    this.loadImages(this.imagesHurt);
    this.loadImages(this.imagesAlert);
    this.loadImages(this.imagesAttack);

    this.speed = 0.15 + Math.random() * 0.5;
    this.attackSpeed = this.speed * 3;
    this.enrageSpeed = this.speed * 7;

    this.animate();
  }

  /**
  * Starts intervals for movement and state animations.
  */
  animate() {
    IntervalHub.startInterval(this.animateMovement, 1000 / 60);
    IntervalHub.startInterval(this.animateState, 170);
  }

  /**
  * Main movement logic. Decides which movement pattern to apply.
  */
  animateMovement = () => {
    if (!this.canMove()) return;
    this.checkEnergyForDash();
    this.checkAttackState();
    this.applyCurrentMovement();
    this.checkIfOutOfWorld();
  };

  /**
  * Executes the movement pattern based on the priority of states.
  */
  applyCurrentMovement() {
    if (this.isBaiting) {
      this.moveBackwards();
    } else if (this.isDashing) {
      this.executeDash();
    } else if (this.energy < 40) {
      this.enragedMove();
    } else if (this.isAttacking) {
      this.attackMove();
    } else {
      this.normalMove();
    }
  }

  /**
  * Checks if the boss energy has dropped below a certain threshold.
  */
  checkEnergyForDash() {
    if (
      this.dashThresholds.length > 0 &&
      this.energy <= this.dashThresholds[0] &&
      !this.isDashing &&
      !this.isBaiting
    ) {
      this.dashThresholds.shift();
      this.startSequence();
    }
  }

  /**
  * Manages the timing of the dash attack (Baiting -> Dashing).
  */
  startSequence() {
    this.isBaiting = true;
    let waitTime = this.energy * 8;
    setTimeout(() => {
      this.isBaiting = false;
      this.isDashing = true;
      setTimeout(() => {
        this.isDashing = false;
      }, 300);
    }, waitTime);
  }

  /**
  * Moves the boss slowly backwards to signal an upcoming attack.
  */
  moveBackwards() {
    this.x += 2;
  }

  /**
  * Performs the high-speed dash attack.
  */
  executeDash() {
    let dashSpeed = 30 - this.energy / 4;
    this.x -= dashSpeed;
  }

  /**
  * Determines if the boss can currently move.
  */
  canMove() {
    return this.isActive && !this.dead && !this.isDying && !this.isHurt;
  }

  /**
  * Moves the boss with enrage speed.
  */
  enragedMove() {
    this.x -= this.enrageSpeed;
  }

  /**
  * Moves the boss with attack speed.
  */
  attackMove() {
    this.x -= this.attackSpeed;
  }

  /**
  * Moves the boss normally to the left.
  */
  normalMove() {
    this.moveLeft();
  }

  /**
  * Updates the animation state of the boss depending on its condition.
  */
  animateState = () => {
    if (!this.isActive) {
      this.handleAlertState();
      return;
    }
    this.startEndbossSound();
    if (this.handleDeadState()) return;
    if (this.handleHurtState()) return;
    if (this.isDashing || this.isBaiting || this.isAttacking) {
      this.playAnimation(this.imagesAttack);
      return;
    }
    this.handleWalkingState();
  };

  /**
  * Handles dead state animations and triggers winning screen.
  */
  handleDeadState() {
    if (this.dead || this.isDying) {
      this.playAnimation(this.imagesDead);
      AudioHub.stopOne(AudioHub.endbossSound);
      this.stopIdleSound();
      this.playDeathSoundOnce();
      showWinningScreen();
      return true;
    }
    return false;
  }

  /**
  * Handles hurt state animations and plays hurt sounds.
  */
  handleHurtState() {
    if (this.isHurt) {
      this.playAnimation(this.imagesHurt);
      this.stopIdleSound();
      const sound = Math.random() < 0.5 ? AudioHub.chickenDead : AudioHub.chickenDead2;
      AudioHub.playOne(sound);
      return true;
    }
    return false;
  }

  /**
  * Handles walking animation and plays idle sound.
  */
  handleWalkingState() {
    this.playAnimation(this.imagesWalking);
    this.playIdleSound();
  }

  /**
  * Handles alert animation when boss is not yet active.
  */
  handleAlertState() {
    this.playAnimation(this.imagesAlert);
    this.stopIdleSound();
  }

  /**
  * Plays looping idle sound if not already playing.
  */
  playIdleSound() {
    if (!this.idleSoundPlaying) {
      AudioHub.endbossIdle.loop = true;
      AudioHub.playOne(AudioHub.endbossIdle);
      this.idleSoundPlaying = true;
    }
  }

  /**
  * Stops the idle sound.
  */
  stopIdleSound() {
    AudioHub.stopOne(AudioHub.endbossIdle);
    this.idleSoundPlaying = false;
  }

  /**
  * Plays the endboss death sound.
  */
  playDeathSound() {
    AudioHub.playOne(AudioHub.endbossDeath);
  }

  /**
  * Plays the death sound only once.
  */
  playDeathSoundOnce() {
    if (!this.deathSoundPlayed) {
      this.playDeathSound();
      this.deathSoundPlayed = true;
    }
  }

  /**
  * Starts looping the endboss approach sound if not already playing.
  */
  startEndbossSound() {
    if (!this.endbossSoundPlaying) {
      AudioHub.endbossSound.loop = true;
      AudioHub.playOne(AudioHub.endbossSound);
      this.endbossSoundPlaying = true;
    }
  }

  /**
  * Checks if the boss should start attacking normally.
  */
  checkAttackState() {
    if (!this.isAttacking && this.energy < 50 && this.isActive && !this.dead) {
      this.isAttacking = true;
    }
  }

  /**
  * Checks if the boss has moved out of the world boundary.
  */
  checkIfOutOfWorld() {
    const worldStart = 0;
    if (this.x + this.width < worldStart) {
      showLosingScreen();
    }
  }
}