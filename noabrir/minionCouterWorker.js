// minionCounterWorker.js

self.onmessage = function (event) {
    const { action, minionCount } = event.data;
  
    if (action === "updateMinionCount") {
      // Simulación de procesamiento o verificación del contador de minions
      const updatedCount = minionCount; // En este caso, simplemente devuelve el mismo valor
  
      // Envía de vuelta el conteo actualizado de minions
      self.postMessage({
        action: "minionCountUpdated",
        updatedCount: updatedCount,
      });
    }
  };
  