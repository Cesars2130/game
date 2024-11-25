export default class ConcurrentTasks {
  constructor() {
    this.workers = [];
  }

  addWorker(workerScriptPath) {
    const worker = new Worker(new URL(workerScriptPath, import.meta.url));
    this.workers.push(worker);
    return worker;
  }

  addModuleWorker(workerScriptPath) {
    const worker = new Worker(new URL(workerScriptPath, import.meta.url), { type: "module" });
    this.workers.push(worker);
    return worker;
  }

  sendToWorker(workerIndex, message) {
    const worker = this.workers[workerIndex];
    if (worker) {
      worker.postMessage(message);
    }
  }

  setWorkerListener(workerIndex, callback) {
    const worker = this.workers[workerIndex];
    if (worker) {
      worker.onmessage = callback;
    }
  }

  terminateAllWorkers() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
  }

  removeWorker(worker) {
    const index = this.workers.indexOf(worker);
    if (index !== -1) {
      // Terminar el worker y removerlo del array
      this.workers[index].terminate();
      this.workers.splice(index, 1);
      return true; // Operación exitosa
    }
    console.warn("Worker not found. Cannot remove.");
    return false; // Operación fallida
  }  
}
