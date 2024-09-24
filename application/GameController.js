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
  goldPerDelivery: 100,
  maxMinions: 10,

  init: function (canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");

    // Crear base y minas
    this.base = GameLogic.createBase(600, 300, 150);
    this.mines = [
      GameLogic.createMine(100, 100, 90),
      GameLogic.createMine(200, 400, 90),
      GameLogic.createMine(400, 150, 90)
    ];

    // Añadir minion inicial
    this.addMinion(true);

    // Iniciar el loop de renderizado
    this.startConcurrentTasks();
  },

  addMinion: function (isFirst = false) {
    if (isFirst || (this.minions.length < this.maxMinions && this.score >= this.minionPrice)) {
      if (!isFirst) {
        this.score -= this.minionPrice;
        this.updateGoldCount();
      }
      const assignedMine = this.mines[this.minions.length % this.mines.length];
      this.minions.push(GameLogic.createMinion(50, 50, 90, 1, assignedMine, this.base));

      this.minionCount++;
      this.updateMinionCount();
    } else {
      console.log("No tienes suficiente oro o has alcanzado el máximo de minions.");
    }
  },

  startConcurrentTasks: function () {
    setInterval(() => {
      this.update();
      this.render();
    }, 1000 / 60); // 60 FPS
  },

  update: function () {
    // Actualizar cada minion
    this.minions.forEach(minion => {
      GameLogic.updateMinion(minion, this); // Pasamos el controlador para actualizar el score
    });
  },
  
  

  render: function () {
    // Limpiar el canvas antes de redibujar
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar fondo
    if (Resources.images.bg) {
      this.ctx.drawImage(
        Resources.images.bg,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }

    // Dibujar base
    if (Resources.images.base) {
      this.ctx.drawImage(
        Resources.images.base,
        this.base.x,
        this.base.y,
        this.base.size,
        this.base.size
      );
    }

    // Dibujar minas
    this.mines.forEach(mine => {
      if (Resources.images.mine) {
        this.ctx.drawImage(
          Resources.images.mine,
          mine.x,
          mine.y,
          mine.size,
          mine.size
        );
      }
    });

    // Dibujar minions
    this.minions.forEach(minion => {
      if (Resources.images.minion) {
        this.ctx.drawImage(
          Resources.images.minion,
          minion.x,
          minion.y,
          minion.size,
          minion.size
        );
      }
    });
  },

  updateGoldCount: function () {
    document.getElementById("goldCount").innerText = this.score;
  },

  updateMinionCount: function () {
    document.getElementById("minionCount").innerText = this.minionCount;
  }
};

export default GameController;
