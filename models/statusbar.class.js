/**
* class Statusbar
* extends DrawableObject
*/
class Statusbar extends DrawableObject {
  images = ImageHub.statusbar.health;
  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.images);
    this.x = 30;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
  * Sets the health percentage and updates the displayed image.
  * @param {number} percentage - Current health percentage (0–100).
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
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}