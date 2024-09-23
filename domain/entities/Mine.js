class Mine {
  constructor(x, y, size, hasGold = true) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.hasGold = hasGold;
  }

  extractGold() {
    this.hasGold = Math.random() > 0.1; // 90% de probabilidad de tener oro
  }
}

export default Mine;
