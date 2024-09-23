import GameLogic from "../domain/GameLogic.js";
import Resources from "../domain/Resources.js";

const GameController = {
  canvas: null,
  ctx: null,
  minions: [],
  base: null,
  mines: [],
  score: 0,
  minionCount: 0,
  minionPrice: 100,
  goldPerDelivery: 10,
  maxMinions: 10,

  init: function (canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");

    this.base = GameLogic.createBase(600, 300, 150);
    this.mines = [
      GameLogic.createMine(100, 100, 90),
      GameLogic.createMine(200, 400, 90),
      GameLogic.createMine(400, 150, 90)
    ];
    this.addMinion(true);
    this.startConcurrentTasks();
  },

  addMinion: function (isFirst = false) {
    if (isFirst || (this.minions.length < this.maxMinions && this.score >= this.minionPrice)) {
      if (!isFirst) {
        this.score -= this.minionPrice;
        this.updateGoldCount();
      }
      
      const assignedMine = this.mines[this.minions.length % this.mines.length];
      this.minions.push(GameLogic.createMinion(50, 50, 90, 1, assignedMine));
      this.minionCount++;
      this.updateMinionCount();
    } else {
      console.log("No tienes suficiente oro o has alcanzado el máximo de minions.");
    }
  },

  startConcurrentTasks: function () {
    setInterval(() => {
    }, 1000 / 60);
  },

  updateGoldCount: function () {
    document.getElementById("goldCount").innerText = this.score;
  },

  updateMinionCount: function () {
    document.getElementById("minionCount").innerText = this.minionCount;
  }
};

export default GameController;
