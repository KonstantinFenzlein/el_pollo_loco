/**
* class Coins
* extends DrawableObject
*/
class Coins extends DrawableObject {
  height = 100;
  width = 100;
  images = ImageHub.coin.coin;

  offset = {
    top: 35,
    right: 35,
    bottom: 35,
    left: 35,
  };

  constructor() {
    super().loadImg("img_pollo_locco/img/8_coin/coin_1.png");
    this.loadImages(this.images);
    this.x = 200 + Math.random() * 1500;
    this.y = 150 + Math.random() * 100;
    this.collected = false;
    this.animate();
  }

  /** Starts interval to animate the coin frames. */
  animate() {
    IntervalHub.startInterval(this.animateCoin, 300);
  }

  /** Updates the coin image to the next frame in the animation. */
  animateCoin = () => {
    let i = this.currentImage % this.images.length;
    let path = this.images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  };
}