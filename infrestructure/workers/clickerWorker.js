let intervalId = null;
let currentClicker = null;

self.onmessage = function(e) {
  const { clicker } = e.data;
  currentClicker = clicker;

  if (!intervalId) {
    intervalId = setInterval(() => {
      if (currentClicker.clicks > 0) {
        currentClicker.clicks--;
        
        self.postMessage({
          type: 'click',
          clicker: currentClicker,
          scoreGained: currentClicker.score
        });

        if (currentClicker.clicks <= 0) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    }, 500);  // Intervalo de 500ms entre clicks
  }
};