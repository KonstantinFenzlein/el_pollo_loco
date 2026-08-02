/**
* class Chicken
* extends MovableObject
*/
class Chicken extends MovableObject {
  y = 360;
  height = 60;
  width = 60;
  imagesWalking = ImageHub.chicken.walking;
  imagesDead = ImageHub.chicken.dead;

  constructor() {
    super().loadImg("img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesDead);
    this.x = 700 + Math.random() * 700;
    this.speed = 0.15 + Math.random() * 0.5;
    this.dead = false;
    this.isDying = false;
  }

  /** Starts intervals for chicken movement and death animations. */
  animate() {
    IntervalHub.startInterval(this.animateChickenmovement, 1000 / 60);
    IntervalHub.startInterval(this.animateChickenDeath, 170);
  }

  /** Moves the chicken to the left if it is alive and not dying. */
  animateChickenmovement = () => {
    if (!this.dead && !this.isDying) {
      this.moveLeft();
    }
  };

  /** Handles chicken death animation or continues walking animation. */
  animateChickenDeath = () => {
    if (this.dead) return;
    if (this.isDying) {
      this.playAnimation(this.imagesDead);
    } else {
      this.playAnimation(this.imagesWalking);
    }
  };
}