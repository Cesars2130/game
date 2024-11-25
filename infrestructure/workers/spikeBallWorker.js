import SpikeBall from '../../domain/entities/SpikeBall.js';

self.onmessage = function(e) {
  const { spikeBallData, canvasWidth, canvasHeight, minions } = e.data;
  
  // Recreate SpikeBall instance with the received data
  const spikeBall = new SpikeBall(canvasWidth, canvasHeight);
  Object.assign(spikeBall, spikeBallData);

  // Check for collisions with minions
  let collision = false;
  let collidedMinionId = null;

  for (let i = 0; i < minions.length; i++) {
    if (spikeBall.checkCollision(minions[i])) {
      collision = true;
      collidedMinionId = minions[i].id;
      break;
    }
  }

  const outOfBounds = spikeBall.move(canvasWidth, canvasHeight);

  self.postMessage({
    spikeBall: {
      x: spikeBall.x,
      y: spikeBall.y,
      size: spikeBall.size,
      speedX: spikeBall.speedX,
      speedY: spikeBall.speedY,
      active: spikeBall.active,
    },
    collision,
    collidedMinionId,
    outOfBounds,
  });
};