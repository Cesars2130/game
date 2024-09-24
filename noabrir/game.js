const Resources = {
  images: {},
  sounds: {},
  currentSkins: {
    minion: "minion.png",
    mine: "mine.png",
    base: "base.png",
  },
  loadResource: function (source) {
    return new Promise((resolve, reject) => {
      if (source.type === "image") {
        const img = new Image();
        img.src = source.path;
        img.onload = () => {
          Resources.images[source.name] = img;
          resolve();
        };
        img.onerror = () => {
          reject();
        };
      } else if (source.type === "sound") {
        const audio = new Audio(source.path);
        Resources.sounds[source.name] = audio;
        resolve();
      }
    });
  },
  loadResources: async function (sources, callback) {
    try {
      await Promise.all(sources.map(this.loadResource));
      callback(); // Llamada cuando todos los recursos estén listos
    } catch (error) {
      console.error("Error al cargar los recursos:", error);
    }
  },
};
const minionWorker = new Worker("worker.js");
const mineWorker = new Worker("mineWorker.js");
const minionCounterWorker = new Worker("minionCounterWorker.js"); // Nuevo worker

mineWorker.onmessage = function (event) {
  const { action, updatedMines } = event.data;
  if (action === "minesUpdated") {
    Game.mines = updatedMines;
    console.log("Minas actualizadas:", Game.mines);
  }
};

// Función para solicitar la verificación de minas al worker
function checkMines() {
  mineWorker.postMessage({ action: "checkMines", mines: Game.mines });
}

// Verificar el estado de las minas cada 5 segundos
setInterval(checkMines, 5000);

const Game = {
  canvas: document.getElementById("gameCanvas"),
  ctx: null,
  minions: [],
  base: { x: 600, y: 300, size: 150 },
  mines: [
    { x: 100, y: 100, size: 90, hasGold: true },
    { x: 200, y: 400, size: 90, hasGold: true },
    { x: 400, y: 150, size: 90, hasGold: true },S
  ],
  score: 11110,
  minionCount: 0,
  minionPrice: 100,
  goldPerDelivery: 10,
  maxMinions: 10,
  firstMinionAutomatic: true,

  init: function () {
    this.ctx = this.canvas.getContext("2d");
    this.addMinion(true);
    this.startConcurrentTasks();
  },

  
  startConcurrentTasks: function () {
    // Enviar tareas al minionWorker para mover los minions
    setInterval(() => {
      minionWorker.postMessage({
        action: "moveMinions",
        minions: this.minions,
        mines: this.mines,
        base: this.base,
      });
    }, 1000 / 60); // 60 fps
  },

  // Comunicación con el minionWo


  addMinion: function (isFirst = false) {
    if (isFirst || (this.minions.length < this.maxMinions && this.score >= this.minionPrice)) {
      if (!isFirst) {
        this.score -= this.minionPrice;
        this.updateGoldCount();
      }
      
      let assignedMine = this.mines[this.minions.length % this.mines.length];
      this.minions.push({
        x: 50,
        y: 50,
        size: 90,
        speed: 1,
        carryingGold: false,
        state: "goingToMine",
        assignedMine: assignedMine,
      });
      this.minionCount++;
      this.updateMinionCount();
      this.updateMinionPrice();
      console.log("Nuevo minion añadido");
      
      // Enviar el nuevo conteo de minions al worker
      minionCounterWorker.postMessage({
        action: "updateMinionCount",
        minionCount: this.minionCount,
      });
    } else {
      console.log("No tienes suficiente oro o has alcanzado el máximo de minions.");
    }
  },

  updateGoldCount: function () {
    document.getElementById("goldCount").innerText = this.score;
  },

  updateMinionCount: function () {
    document.getElementById("minionCount").innerText = this.minionCount;
  },

  updateMinionPrice: function () {
    this.minionPrice = 100 * (this.minionCount + 1);
    document.getElementById("minionCost").innerText = this.minionPrice;
  },

  draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibuja el fondo
    this.ctx.drawImage(
      Resources.images.bg,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Dibuja la base, las minas y los minions
    this.drawBase();
    this.drawMines();
    this.drawMinions();
  },

  gameLoop: function () {
    this.draw();
    requestAnimationFrame(this.gameLoop.bind(this));
  },

  drawBase: function () {
    this.ctx.drawImage(
      Resources.images.base,
      this.base.x,
      this.base.y,
      this.base.size,
      this.base.size
    );
  },

  drawMines: function () {
    this.mines.forEach((mine) => {
      this.ctx.drawImage(
        Resources.images.mine,
        mine.x,
        mine.y,
        mine.size,
        mine.size
      );
    });
  },

  drawMinions: function () {
    this.minions.forEach((minion) => {
      this.ctx.drawImage(
        Resources.images.minion,
        minion.x,
        minion.y,
        minion.size,
        minion.size
      );
    });
  },
};

// Comunicación con el worker del contador de minions
minionCounterWorker.onmessage = function (event) {
  const { action, updatedCount } = event.data;
  if (action === "minionCountUpdated") {
    console.log(`Contador de minions actualizado: ${updatedCount}`);
  }
};

minionWorker.onmessage = function (event) {
  const { action, updatedMinions } = event.data;
  if (action === "minionsMoved") {
    Game.minions = updatedMinions;
  } else if (action === "deliverGold") {
    Game.score += Game.goldPerDelivery;
    Game.updateGoldCount();
  }
};

// Eventos de interfaz y botones
document.getElementById("buyMinionButton").addEventListener("click", () => {
  Game.addMinion();
});

// Iniciar el juego cuando los recursos estén listos
Resources.loadResources(
  [
    { name: "minion", path: "assets/minion.png", type: "image" },
    { name: "mine", path: "assets/mine.png", type: "image" },
    { name: "base", path: "assets/base.png", type: "image" },
    { name: "gold", path: "assets/gold.png", type: "image" },
    { name: "cashRegister", path: "assets/cachin.mp3", type: "sound" },
    { name: "bg", path: "assets/bg.jpg", type: "image" },
  ],
  () => {
    Game.init();
    Game.gameLoop();
  }
);
