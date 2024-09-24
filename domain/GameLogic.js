import Minion from './entities/Minion.js';

const GameLogic = {
  createMinion(x, y, size, speed, assignedMine, base) {
    return new Minion(x, y, size, speed, assignedMine, base);
  },

  createMine(x, y, size) {
    return { x: x, y: y, size: size };
  },

  createBase(x, y, size) {
    return { x: x, y: y, size: size };
  },

  // Método para actualizar el minion
  updateMinion(minion, controller) {
    if (minion.state === 'goingToMine') {
      minion.moveTo(minion.assignedMine.x, minion.assignedMine.y);
      if (minion.x === minion.assignedMine.x && minion.y === minion.assignedMine.y) {
        minion.state = 'collectingGold';
        setTimeout(() => {
          minion.hasGold = true;
          minion.state = 'returningToBase';
        }, 1000); // Tiempo para recoger el oro
      }
    }

    if (minion.state === 'returningToBase' && minion.hasGold) {
      minion.moveTo(minion.base.x, minion.base.y);
      if (minion.x === minion.base.x && minion.y === minion.base.y) {
        minion.hasGold = false;
        minion.state = 'goingToMine';
        controller.score += controller.goldPerDelivery;
        controller.updateGoldCount();
        console.log('Minion ha entregado oro. Oro actualizado.');
      }
    }
  }
};

export default GameLogic;
