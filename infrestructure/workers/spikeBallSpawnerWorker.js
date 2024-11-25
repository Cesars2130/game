self.onmessage = function (e) {
  const { interval } = e.data;

  setInterval(() => {
      self.postMessage({ spawn: true });
  }, interval || 15000); // Default: 15 segundos
};
