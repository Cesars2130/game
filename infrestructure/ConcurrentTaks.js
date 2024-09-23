export class ConcurrentTasks {
    constructor() {
      if (window.Worker) {
        this.worker = new Worker("worker.js");
      }
    }
  
    startTask(task, callback) {
      this.worker.postMessage(task);
  
      this.worker.onmessage = function (e) {
        callback(e.data);
      };
    }
  
    stopTask() {
      this.worker.terminate();
    }
  }
  