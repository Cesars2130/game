let animationFrameId = null;

onmessage = function (event) {
  
  const { minion, target } = event.data;
  
  if (!minion || !target) {
    console.error('Invalid data received in worker:', event.data);
    return;
  }

  //console.log('Starting movement from', {x: minion.x, y: minion.y}, 'to', {x: target.x, y: target.y});
  
  // Cancelar cualquier animación anterior
  if (animationFrameId) {
    console.log('Canceling previous animation');
    clearTimeout(animationFrameId);
  }

  const moveMinion = () => {
    // Calcular la dirección del movimiento
    const dx = target.x - minion.x;
    const dy = target.y - minion.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    //console.log('Current distance to target:', distance);

    // Si estamos lo suficientemente cerca del objetivo
    if (distance < minion.speed) {
      console.log('Target reached');
      minion.x = target.x;
      minion.y = target.y;
      postMessage({ minion, reachedTarget: true });
      return;
    }

    // Normalizar el vector de dirección y multiplicar por la velocidad
    const normalizedDx = (dx / distance) * minion.speed;
    const normalizedDy = (dy / distance) * minion.speed;

    // Actualizar posición
    minion.x += normalizedDx;
    minion.y += normalizedDy;

    // Enviar actualización de posición
    postMessage({ minion, reachedTarget: false });

    // Programar siguiente frame
    animationFrameId = setTimeout(moveMinion, 1000 / 60);
  };

  // Iniciar el movimiento
  moveMinion();
};

// Manejar errores
onerror = function(error) {
  console.error('Worker error:', error);
};