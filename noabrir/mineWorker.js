self.onmessage = function (event) {
    const { action, mines } = event.data;
  
    if (action === "checkMines") {
      // Verificar si las minas todavía tienen oro disponible
      const updatedMines = mines.map(mine => {
        if (mine.hasGold) {
          // Simula la extracción de oro (reducir el oro disponible en cada mina)
          mine.hasGold = Math.random() > 0.1; // 90% de probabilidad de seguir teniendo oro
        }
        return mine;
      });
  
      // Enviar el estado actualizado de las minas al juego principal
      self.postMessage({ action: "minesUpdated", updatedMines });
    }
  };
  