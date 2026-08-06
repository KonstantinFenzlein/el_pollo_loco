/**
* class World
*/

class World {
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  character = new Character();
  level = null;
  throwObject = false;
  throwabelObjects = [];
  coins = [];
  bottles = [];

  statusbar = new Statusbar();
  statusbarBoss = new StatusbarBoss();
  statusbarBottle = new StatusbarBottle();
  statusbarCoin = new StatusbarCoin();

  constructor(canvas, keyboard, _level) {
    this.level = _level;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
    this.level.startLevel();
  }

  /** Links the character to this world. */
  setWorld() {
    this.character.world = this;
  }

  /** Starts the main game loops and collision checks. */
  run() {
    IntervalHub.startInterval(this.checkCollisions, 1000 / 60);
    IntervalHub.startInterval(this.checkThrowObjects, 1000 / 60);
    IntervalHub.startInterval(this.checkBottleCollisions, 1000 / 60);
    IntervalHub.startInterval(this.checkBottleThrowCollisions, 1000 / 60);
    IntervalHub.startInterval(this.checkCoinCollisions, 1000 / 60);
    IntervalHub.startInterval(this.checkEndbossCollisions, 1000 / 60);
    IntervalHub.startInterval(this.checkEndbossBottleCollision, 1000 / 60);
    IntervalHub.startInterval(this.checkEndbossActivation, 1000 / 60);
    IntervalHub.startInterval(() => {this.level.endboss.forEach((boss) => boss.checkAttackState());}, 1000 / 60);
  }

  /** Checks whether the player can throw a bottle and initiates it. */
  checkThrowObjects = () => {
    if (this.canThrow()) this.throwBottle();
    else if (this.throwObject && !this.keyboard.D) this.resetThrow();
  };

  /** Returns true if a bottle can be thrown. */
  canThrow = () => {
    const now = Date.now();
    const timeSinceLastThrow = now - this.character.lastMove; 
    const cooldown = 500;
    return (
      this.keyboard.D && !this.throwObject && this.character.bottleCount >= 1 && timeSinceLastThrow > cooldown
    );
  };

  /** Creates a new throwable object and adds it to the world. */
  throwBottle = () => {
    const direction = this.character.otherDirection ? -1 : 1;
    const offsetX = direction === 1 ? 100 : -40;
    const bottle = new ThrowableObject(
      this.character.x + offsetX,
      this.character.y + 100,
      direction
    );
    this.throwObject = true;
    this.throwabelObjects.push(bottle);
    this.character.useBottle();
  };

  /** Resets throwObject flag after throwing. */
  resetThrow = () => {
    this.throwObject = false;
  };

  /** Checks collisions between character and enemies. */
  checkCollisions = () => {
    this.level.enemies.forEach((enemy) => {
    if (enemy.dead || enemy.isDying) return;
    if (this.character.isColliding(enemy)) {
      if (this.character.isAboveGround() && this.character.speedY < 0)
        enemy.die();
      else {
        this.character.hit();
        this.statusbar.setPercentage(this.character.energy);
      }
    }
    });
  };

  /** Checks collisions between character and endbosses. */
  checkEndbossCollisions = () => {
    this.level.endboss.forEach((boss) => {
     if (this.character.isColliding(boss)) {
        this.character.hit();
        this.statusbar.setPercentage(this.character.energy);
      }
    });
  };

  /** Checks collisions between character and collectible bottles. */
  checkBottleCollisions = () => {
    this.level.bottles.forEach((bottle) => {
    if (!bottle.collected && this.character.isColliding(bottle)) {
      bottle.collected = true;
      this.character.collect();
      this.statusbarBottle.setPercentage((this.character.bottleCount / 10) * 100);
    }
    });
  };

  /** Checks collisions between character and collectible coins. */
  checkCoinCollisions = () => {
    this.level.coins.forEach((coin) => {
    if (!coin.collected && this.character.isColliding(coin)) {
      coin.collected = true;
      this.character.collectCoin();
      this.statusbarCoin.setPercentage((this.character.coinCount / 10) * 100);
    }
    });
  };

  /** Checks collisions between thrown bottles and enemies. */
  checkBottleThrowCollisions = () => {
    this.throwabelObjects.forEach((bottle) => {
    this.level.enemies.forEach((enemy) => {
    if (enemy.dead || bottle.targetHit) return;
      if (bottle.isColliding(enemy)) {
        enemy.die();
        bottle.startSplash();
      }
    });
    });
  };

  /** Checks collisions between thrown bottles and endbosses. */
  checkEndbossBottleCollision = () => {
    this.throwabelObjects.forEach((bottle) => {
    if (bottle.targetHit) return;
    this.level.endboss.forEach((boss) => {
    if (boss.dead) return;
    if (bottle.isColliding(boss)) {
      bottle.targetHit = true;
      boss.hitBoss();
      this.statusbarBoss.setPercentage(boss.energy);
      bottle.startSplash();
    }
    if (boss.isDead()) this.killBossAfterDelay(boss);
    });
    });
  };

  /** Schedules endboss death after a short delay. */
  killBossAfterDelay = (boss) => {
    boss.isDying = true;
    setTimeout(() => {
      boss.dead = true;
    }, 1500);
  };

  /** Activates endbosses when character reaches their activation point. */
  checkEndbossActivation = () => {
    this.level.endboss.forEach((boss) => {
    if (!boss.isActive && this.character.x >= boss.activationX)
      boss.isActive = true;
    });
  };

  /** Main drawing function called each frame. */
  draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawBackground();
    this.ctx.translate(-this.camera_x, 0);
    this.drawUI();
    this.ctx.translate(this.camera_x, 0);
    this.drawGameObjects();
    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(() => this.draw());
  };

  /** Draws background objects and clouds. */
  drawBackground = () => {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
  };

  /** Draws game objects: throwables, coins, bottles, enemies, endboss, character. */
  drawGameObjects = () => {
    this.addObjectsToMap(this.throwabelObjects.filter((b) => !b.splashed));
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies.filter((e) => !e.dead));
    this.addObjectsToMap(this.level.endboss.filter((b) => !b.dead));
    this.addToMap(this.character);
  };

  /** Draws UI elements (health, bottles, coins, boss health). */
  drawUI = () => {
    this.addToMap(this.statusbar);
    this.addToMap(this.statusbarBoss);
    this.addToMap(this.statusbarBottle);
    this.addToMap(this.statusbarCoin);
  };

  /** Adds an array of drawable objects to the canvas. */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
    if (!o.collected) this.addToMap(o);
    });
  }

  /** Draws a single drawable object to the canvas, handling flips. */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /** Flips a drawable object horizontally. */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
    mo.realX = mo.realX * -1;
  }

  /** Restores flipped drawable object to original orientation. */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    mo.realX = mo.realX * -1;
    this.ctx.restore();
  }
}