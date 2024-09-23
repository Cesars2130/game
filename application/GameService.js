import { Game } from "../domain/GameLogic.js";
import { Minion } from "../domain/entities/Minion.js";

export class GameService {
  constructor() {
    this.game = new Game([], [], {});
  }

  addMinion(mine) {
    const minion = new Minion(50, 50, 1, mine);
    this.game.addMinion(minion);
  }

  moveMinions() {
    this.game.moveMinions();
  }

  updateScore(gold) {
    this.game.score += gold;
  }
}
