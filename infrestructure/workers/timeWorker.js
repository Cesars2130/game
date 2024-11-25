let elapsedSeconds = 0;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

onmessage = function () {
  // Inicia el contador
  setInterval(() => {
    elapsedSeconds++;
    postMessage(formatTime(elapsedSeconds));
  }, 1000); // Cada segundo
};
