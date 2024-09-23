self.onmessage = function (event) {
    const { action, mine } = event.data;
  
    if (action === "extractGold") {
      if (mine.hasGold) {
        mine.hasGold = Math.random() > 0.1; // 90% chance de obtener oro
        self.postMessage({ action: "goldExtracted", hasGold: mine.hasGold });
      } else {
        self.postMessage({ action: "noGoldLeft" });
      }
    }
  };
  