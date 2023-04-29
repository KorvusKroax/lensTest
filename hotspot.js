class HotSpot {
  constructor(x, y, w, h, padding) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.padding = padding;
  }

  contains(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
  }

  move(x, y) {
    if (x >= -this.padding && x + this.w < imgWidth + this.padding) this.x = x;
    else if (x < -this.padding) this.x = -this.padding;
    else if (x + this.w > imgWidth + this.padding) this.x = imgWidth - this.w + this.padding;

    if (y >= -this.padding && y + this.h < imgHeight + this.padding) this.y = y;
    else if (y < -this.padding) this.y = -this.padding;
    else if (y + this.h > imgHeight + this.padding) this.y = imgHeight - this.h + this.padding;
  }

  show() {
    noFill();
    stroke(0, 127);
    strokeWeight(1);
    rect(this.x, this.y, this.w, this.h);
  }
}
