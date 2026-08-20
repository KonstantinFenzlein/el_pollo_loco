/**
* class DrawableObject
*/
class DrawableObject {
  x = 120;
  y = 330;
  width = 120;
  height = 50;
  img;
  imageCache = [];
  currentImage = 0;

  offset = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  realX;
  realY;
  realWidth;
  realHeight;

  constructor() {
    IntervalHub.startInterval(this.getRealFrame, 1000 / 60);
  }

  /** Updates the real position and size of the object considering its offsets. */
  getRealFrame = () => {
    this.realX = this.x + this.offset.left;
    this.realY = this.y + this.offset.top;
    this.realWidth = this.width - this.offset.left - this.offset.right;
    this.realHeight = this.height - this.offset.top - this.offset.bottom;
  };

  /**
  * Checks if this object is colliding with another DrawableObject.
  * @param {DrawableObject} mo - The other object to check collision against.
  * @returns {boolean} True if the objects are colliding, otherwise false.
  */
  isColliding(mo) {
    return (
      this.realX + this.realWidth > mo.realX &&
      this.realY + this.realHeight > mo.realY &&
      this.realX < mo.realX + mo.realWidth &&
      this.realY < mo.realY + mo.realHeight
    );
  }

  /**
  * Loads a single image into this object.
  * @param {string} path - The path to the image file.
  */
  loadImg(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
  * Loads multiple images and stores them in the image cache.
  * @param {string[]} arr - Array of image paths to load.
  */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
  * Draws the object's current image on the given canvas context.
  * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
  */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
  * Placeholder for drawing a frame around the object (e.g., for debugging).
  * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
  */
  drawFrame(ctx) {}
}