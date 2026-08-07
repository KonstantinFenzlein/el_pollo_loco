/**
* class Statusbar
* extends DrawableObject
*/
class StatusbarBoss extends DrawableObject {
  images = ImageHub.statusbar.endboss;
  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.images);
    this.x = 500;
    this.y = 20;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
    }

  /**
  * Sets the boss health percentage and updates the displayed image accordingly.
  * @param {number} percentage - The current health percentage (0–100).
  */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
  * Determines which image to display based on the current percentage.
  * @returns {number} Index of the image in the images array.
  */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 79) {
      return 4;
    } else if (this.percentage > 59) {
      return 3;
    } else if (this.percentage > 39) {
      return 2;
    } else if (this.percentage > 19) {
      return 1;
    } else {
      return 0;
    }
  }
}