class Minion {
  constructor(x, y, size, speed, assignedMine, base) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.assignedMine = assignedMine;
    this.base = base;
    this.hasGold = false;
    this.state = 'goingToMine'; // Estado inicial
  }

  // Método para moverse hacia un objetivo
  moveTo(targetX, targetY) {
    if (this.x < targetX) {
      this.x += this.speed;
    } else if (this.x > targetX) {
      this.x -= this.speed;
    }

    if (this.y < targetY) {
      this.y += this.speed;
    } else if (this.y > targetY) {
      this.y -= this.speed;
    }
  }
}

export default Minion;
