class SpikeBall {
    constructor(canvasWidth, canvasHeight) {
      this.size = 30;
      this.x = Math.random() * (canvasWidth - this.size);
      this.y = Math.random() * (canvasHeight - this.size);
      this.speedX = 3 * (Math.random() > 0.5 ? 1 : -1);
      this.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
      this.active = true;
    }
  
    move(canvasWidth, canvasHeight) {
      // Update position
      this.x += this.speedX;
      this.y += this.speedY;
  
      // Bounce off walls with random angle changes
      if (this.x <= 0 || this.x + this.size >= canvasWidth) {
        this.speedX *= -1;
        this.speedY += (Math.random() - 0.5) * 2; // Add some randomness to Y speed
      }
      if (this.y <= 0 || this.y + this.size >= canvasHeight) {
        this.speedY *= -1;
        this.speedX += (Math.random() - 0.5) * 2; // Add some randomness to X speed
      }
  
      // Keep speed within bounds
      const maxSpeed = 5;
      this.speedX = Math.max(Math.min(this.speedX, maxSpeed), -maxSpeed);
      this.speedY = Math.max(Math.min(this.speedY, maxSpeed), -maxSpeed);
  
      // Check if out of bounds
      return this.x < -this.size || this.x > canvasWidth + this.size || 
             this.y < -this.size || this.y > canvasHeight + this.size;
    }
  
    checkCollision(minion) {
      const dx = (this.x + this.size/2) - (minion.x + minion.size/2);
      const dy = (this.y + this.size/2) - (minion.y + minion.size/2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (this.size/2 + minion.size/2);
    }
  }
  
  export default SpikeBall;