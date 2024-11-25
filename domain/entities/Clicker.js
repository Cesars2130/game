class Clicker {
    constructor(x, y, size, score = 10, clicks = 20) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.score = score;
      this.clicks = clicks;
      this.isActive = true;
    }
}

export default Clicker;