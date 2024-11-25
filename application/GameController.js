import ConcurrentTasks from "../infrestructure/ConcurrentTasks.js";
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
  minionPrice: 200,
  goldPerDelivery: 100,
  maxMinions: 10,
  concurrentTasks: null,
  clickers: [],
  clickerPrice: 100,
  minionWorkers: [],
  clickerWorkers: [],
  spikeBalls: [],
  spikeBallWorkers: [],
  spikeBallSpawner: null,
  gameOver: false, // Nueva bandera para manejar el estado del juego
  
  

  init: function (canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.concurrentTasks = new ConcurrentTasks();
    this.gameOver = false;
    

    // Crear base y minas
    this.base = GameLogic.createBase(600, 300, 150);
    this.mines = [
      GameLogic.createMine(100, 100, 90),
      GameLogic.createMine(200, 400, 90),
      GameLogic.createMine(400, 150, 90)
    ];

    console.log('Base created at:', this.base);
    console.log('Mines created at:', this.mines);

    // Añadir minion inicial
    this.addMinion(true);

    // Iniciar el loop de renderizado
    this.startConcurrentTasks();

    this.startSpikeBallSpawner();

    this.startTimer();
  },

  endGame() {
    this.gameOver = true;

    // Detener todas las tareas concurrentes
    this.concurrentTasks.terminateAllWorkers();

    // Mostrar mensaje Game Over
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = "48px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Game Over", this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.fillText(`Score ${this.score}`,this.canvas.width / 2, this.canvas.height / 1.7)

    console.log("Game Over: Todos los mineros han sido destruidos.");
  },

  destroySpikeBall(index) {
    this.spikeBalls.splice(index, 1);
    const worker = this.spikeBallWorkers.splice(index, 1)[0];
    if (worker) {
      this.concurrentTasks.removeWorker(worker);
    }
  },

  startSpikeBallSpawner() {
    if (this.gameOver) return;
    this.spikeBallSpawner = this.concurrentTasks.addWorker("../infrestructure/workers/spikeBallSpawnerWorker.js");
    this.spikeBallSpawner.postMessage({ interval: 15000 });

    this.concurrentTasks.setWorkerListener(this.concurrentTasks.workers.length - 1, () => {
      this.spawnSpikeBall();
    });
  },

  spawnSpikeBall() {
    const spikeBall = GameLogic.createSpikeBall(this.canvas.width, this.canvas.height);
    const worker = this.concurrentTasks.addModuleWorker("../infrestructure/workers/spikeBallWorker.js");
    const workerIndex = this.concurrentTasks.workers.length - 1;

    this.spikeBalls.push(spikeBall);
    this.spikeBallWorkers.push(worker);

    this.concurrentTasks.setWorkerListener(workerIndex, (event) => {
      const { spikeBall: updatedSpikeBall, collision, collidedMinionId, outOfBounds } = event.data;

      const spikeBallIndex = this.spikeBalls.indexOf(spikeBall);
  // Verificar que la bola existe antes de actualizarla
  if (spikeBallIndex !== -1) {
    GameLogic.updateSpikeBall(this.spikeBalls[spikeBallIndex], updatedSpikeBall);

    if (collision) {
      const collidedMinionIndex = this.minions.findIndex((minion) => minion.id === collidedMinionId);
      if (collidedMinionIndex !== -1) {
        this.minions.splice(collidedMinionIndex, 1);
        this.minionWorkers.splice(collidedMinionIndex, 1);
        this.minionCount--;
        this.updateMinionCount();
      }

      if (this.minions.length === 0) {
        this.endGame();
      } else {
        this.concurrentTasks.removeWorker(worker);
      }
      

      this.destroySpikeBall(spikeBallIndex);
    } else if (outOfBounds) {
      this.destroySpikeBall(spikeBallIndex);
    }
  } else {
    console.warn("Worker tried to update a destroyed SpikeBall. Terminating worker.");
    this.concurrentTasks.removeWorker(worker);
  }
    });

    const updateSpikeBall = () => {
      if (this.spikeBalls.includes(spikeBall)) {
        const validMinions = this.minions.filter((minion) => minion && minion.id && minion.x !== undefined && minion.y !== undefined && minion.size);

        this.concurrentTasks.sendToWorker(workerIndex, {
          spikeBallData: {
            x: spikeBall.x,
            y: spikeBall.y,
            size: spikeBall.size,
            speedX: spikeBall.speedX,
            speedY: spikeBall.speedY,
            active: spikeBall.active,
          },
          canvasWidth: this.canvas.width,
          canvasHeight: this.canvas.height,
          minions: validMinions.map((minion) => ({
            id: minion.id,
            x: minion.x,
            y: minion.y,
            size: minion.size,
          })),
        });
        requestAnimationFrame(updateSpikeBall);
      }
    };

    updateSpikeBall();
  },

  startTimer: function () {
    const timerWorker = this.concurrentTasks.addWorker("../infrestructure/workers/timeWorker.js");
  
    let elapsedSeconds = 0;
  
    this.concurrentTasks.setWorkerListener(this.concurrentTasks.workers.length - 1, (event) => {
      const formattedTime = event.data;
      document.getElementById("time").innerText = formattedTime;
  
      // Incrementa el contador de segundos
      elapsedSeconds++;
  
      // Verifica si se alcanzan los dos minutos (120 segundos)
      if (elapsedSeconds >= 120) {
        this.endGame();
      }
    });
  
    timerWorker.postMessage({});
  },
  
  addClicker: function () {
    // Verifica si ya hay un clicker activo
    if (this.clickers.length > 0) {
      console.log("Ya existe un Clicker activo.");
      return;
    }
  
    if (this.score >= this.clickerPrice) {
      this.score -= this.clickerPrice;
      this.updateGoldCount();
  
      const clicker = GameLogic.createClicker(this.canvas.width, this.canvas.height);
      clicker.scale = 1; // Para la animación
      clicker.animating = false;
      this.clickers.push(clicker);
      
      // Crear y configurar worker
      const worker = this.concurrentTasks.addWorker("../infrestructure/workers/clickerWorker.js");
      this.clickerWorkers.push(worker);
      const clickerIndex = this.clickers.length - 1;
      const workerIndex = this.concurrentTasks.workers.length - 1;
      
      this.concurrentTasks.setWorkerListener(workerIndex, (event) => {
        const { type, clicker: updatedClicker, scoreGained } = event.data;
        
        if (type === 'click') {
          this.score += scoreGained;
          this.updateGoldCount();
          this.clickers[clickerIndex] = {
            ...updatedClicker,
            scale: 1.8, // Iniciar animación
            animating: true
          };
          
          if (updatedClicker.clicks <= 0) {
            this.clickers.splice(clickerIndex, 1);
            this.clickerWorkers.splice(clickerIndex, 1);
            this.concurrentTasks.removeWorker(workerIndex);
          }
        }
      });
  
      // Iniciar el worker
      this.concurrentTasks.sendToWorker(workerIndex, {
        clicker: clicker
      });
    } else {
      console.log("No tienes suficiente oro para comprar un Clicker.");
    }
  },
  

  addMinion: function (isFirst = false) {
    if (isFirst || (this.minions.length < this.maxMinions && this.score >= this.minionPrice)) {
      if (!isFirst) {
        this.score -= this.minionPrice;
        this.updateGoldCount();
      }
  
      const assignedMine = this.mines[this.minions.length % this.mines.length];
      const minion = {
        id: `minion-${Date.now()}`,
        x: this.base.x + this.base.size / 2,
        y: this.base.y + this.base.size / 2,
        size: 30,
        speed: 2,
        state: "goingToMine",
        hasGold: false,
        assignedMine: assignedMine,
        base: this.base,
      };
  
      console.log('New minion created:', minion);
  
      this.minions.push(minion);
      const minionIndex = this.minions.length - 1;
  
      // Crear y configurar worker
      const worker = this.concurrentTasks.addWorker("../infrestructure/workers/minionWorker.js");
      this.minionWorkers.push(worker);
      const workerIndex = this.concurrentTasks.workers.length - 1;
  
      this.concurrentTasks.setWorkerListener(workerIndex, (event) => {
        const { minion: updatedMinion, reachedTarget } = event.data;
  
        if (this.minions[minionIndex]) {
          this.minions[minionIndex].x = updatedMinion.x;
          this.minions[minionIndex].y = updatedMinion.y;
  
          if (reachedTarget) {
            console.log('Target reached, current state:', this.minions[minionIndex].state);
            
            if (this.minions[minionIndex].state === "goingToMine") {
              console.log('Starting gold collection');
              this.minions[minionIndex].state = "collectingGold";
              
              setTimeout(() => {
                // console.log('Gold collected, returning to base');
                // this.minions[minionIndex].hasGold = true;
                // this.minions[minionIndex].state = "returningToBase";
                
                // this.concurrentTasks.sendToWorker(workerIndex, {
                //   minion: this.minions[minionIndex],
                //   target: this.base
                // });

                if (this.minions[minionIndex]) {
                  this.minions[minionIndex].hasGold = true;
                  this.minions[minionIndex].state = "returningToBase";
                
                  this.concurrentTasks.sendToWorker(workerIndex, {
                    minion: this.minions[minionIndex],
                    target: this.base
                  });
                } else {
                  console.warn(`Minion con índice ${minionIndex} no encontrado.`);
                }
                
              }, 1000);
              
            } else if (this.minions[minionIndex].state === "returningToBase" && this.minions[minionIndex].hasGold) {
              console.log('Returned to base, going back to mine');
              this.minions[minionIndex].hasGold = false;
              this.minions[minionIndex].state = "goingToMine";
              this.score += this.goldPerDelivery;
              this.updateGoldCount();
              
              this.concurrentTasks.sendToWorker(workerIndex, {
                minion: this.minions[minionIndex],
                target: assignedMine
              });
            }
          }
        } else {
          console.warn(`Minion con índice ${minionIndex} no existe.`);
        }
      });
  
      console.log('Starting initial movement to mine:', assignedMine);
      this.concurrentTasks.sendToWorker(workerIndex, {
        minion: minion,
        target: assignedMine,
      });
  
      this.minionCount++;
      this.updateMinionCount();
    } else {
      console.log("No tienes suficiente oro o has alcanzado el máximo de minions.");
    }
  },
  
  render: function () {
    if (this.gameOver) return;
  
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    // Dibujar fondo
    if (Resources.images.bg) {
      this.ctx.drawImage(Resources.images.bg, 0, 0, this.canvas.width, this.canvas.height);
    }
  
    // Dibujar base
    if (Resources.images.base) {
      this.ctx.drawImage(Resources.images.base, this.base.x, this.base.y, this.base.size, this.base.size);
    }
  
    // Dibujar minas
    this.mines.forEach(mine => {
      if (Resources.images.mine) {
        this.ctx.drawImage(Resources.images.mine, mine.x, mine.y, mine.size, mine.size);
      }
    });
  
    // Dibujar minions
    this.minions.forEach((minion) => {
      if (Resources.images.minion) {
        // Dibujar minion
        this.ctx.drawImage(Resources.images.minion, minion.x, minion.y, minion.size, minion.size);
  
        // Dibujar indicador de oro
        if (minion.hasGold) {
          this.ctx.fillStyle = "gold";
          this.ctx.beginPath();
          this.ctx.arc(minion.x + minion.size / 2, minion.y - 5, 3, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    });
  
    // Dibujar clickers con animación
    this.clickers.forEach(clicker => {
      // Actualizar animación
      if (clicker.animating) {
        clicker.scale -= 0.05;
        if (clicker.scale <= 1) {
          clicker.scale = 1;
          clicker.animating = false;
        }
      }
  
      const scaledSize = clicker.size * clicker.scale;
      const offsetX = (scaledSize - clicker.size) / 2;
      const offsetY = (scaledSize - clicker.size) / 2;
  
      this.ctx.beginPath();
      this.ctx.fillStyle = 'rgba(0, 0, 255, 0.6)';
      this.ctx.arc(
        clicker.x + clicker.size / 2 - offsetX, 
        clicker.y + clicker.size / 2 - offsetY, 
        scaledSize / 2, 
        0, 
        Math.PI * 2
      );
      this.ctx.fill();
      
      // Draw remaining clicks
      this.ctx.fillStyle = 'white';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        clicker.clicks, 
        clicker.x + clicker.size / 2,
        clicker.y + clicker.size / 2
      );
    });
  
    // Dibujar bolas con picos
    this.spikeBalls.forEach((ball) => {
      this.ctx.beginPath();
      this.ctx.arc(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2, 0, Math.PI * 2);
      this.ctx.fillStyle = "red";
      this.ctx.fill();
  
      const spikes = 8;
      const spikeLength = 10;
      this.ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
      this.ctx.lineWidth = 2;
      for (let i = 0; i < spikes; i++) {
        const angle = (i / spikes) * Math.PI * 2;
        const x1 = ball.x + ball.size / 2 + Math.cos(angle) * ball.size / 2;
        const y1 = ball.y + ball.size / 2 + Math.sin(angle) * ball.size / 2;
        const x2 = x1 + Math.cos(angle) * spikeLength;
        const y2 = y1 + Math.sin(angle) * spikeLength;
  
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }
    });
  },  

  startConcurrentTasks: function() {
    console.log('Starting render loop');
    setInterval(() => {
      this.render();
    }, 1000 / 60);
  },

  updateMinionCount: function() {
    document.getElementById("minionCount").innerText = this.minionCount;
  },

  updateGoldCount: function() {
    document.getElementById("goldCount").innerText = this.score;
  }
};

export default GameController;