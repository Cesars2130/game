import Minion from './entities/Minion.js';
import Mine from './entities/Mine.js';
import Base from './entities/Base.js';

const GameLogic = {
  createMinion(x, y, size, speed, assignedMine) {
    return new Minion(x, y, size, speed, assignedMine);
  },
  
  createMine(x, y, size) {
    return new Mine(x, y, size);
  },

  createBase(x, y, size) {
    return new Base(x, y, size);
  }
};

export default GameLogic;
