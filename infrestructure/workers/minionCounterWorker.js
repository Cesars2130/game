self.onmessage = function (event) {
    const { action, currentMinionCount } = event.data;
  
    if (action === "updateMinionCount") {
      const newCount = currentMinionCount + 1;
      self.postMessage({ action: "minionCountUpdated", newCount });
    }
  };
  