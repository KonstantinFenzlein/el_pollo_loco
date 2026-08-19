/**
* class Cloud
* extends MovableObject
*/
class Cloud extends MovableObject {
  width = 700;
  height = 300;
  y = 20;
  randomImg;

  constructor() {
    super();
    this.getRandomImg();
    if (this.randomImg === 0) {
      this.loadImg("img_pollo_locco/img/5_background/layers/4_clouds/1.png");
    } else {
      this.loadImg("img_pollo_locco/img/5_background/layers/4_clouds/2.png");
    }
    this.x = Math.random() * 3500;
    this.animate();
  }

  /**
  * Starts the cloud animation by repeatedly calling `animateClouds`.
  */
  animate() {
    IntervalHub.startInterval(this.animateClouds, 1000 / 60);
  }

  /**
  * Moves the cloud to the left on each animation frame.
  * Called automatically by the animation interval.
  */
  animateClouds = () => {
    this.moveLeft();
  };

  /**
  * Randomly selects an image index for the cloud.
  * Sets `this.randomImg` to either 0 or 1.
  */
  getRandomImg() {
    this.randomImg = Math.floor(Math.random() * 2);
  }
}