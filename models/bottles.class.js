/**
* class Bottles
* extends DrawableObject
*/
class Bottles extends DrawableObject {
  height = 70;
  width = 70;
  offset = {
    top: 15,
    right: 15,
    bottom: 5,
    left: 28,
  };

  randomImg;

  constructor() {
    super();
    this.getRandomImg();
    if (this.randomImg === 0) {
      this.loadImg("img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    } else {
      this.loadImg("img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
    }
    this.x = 200 + Math.random() * 1500;
    this.y = 350 + Math.random() * 10;
    this.collected = false;
  }

  /**
  * Randomly selects an image index for the bottle.
  * Sets `this.randomImg` to either 0 or 1.
  */
  getRandomImg() {
    this.randomImg = Math.floor(Math.random() * 2);
  }
}