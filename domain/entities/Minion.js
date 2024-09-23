class Minion {
  constructor(x, y, size, speed, assignedMine) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.carryingGold = false;
    this.state = "goingToMine";
    this.assignedMine = assignedMine;
  }

  moveTo(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }
}

export default Minion;
