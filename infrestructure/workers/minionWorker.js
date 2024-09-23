self.onmessage = function (event) {
  const { action, minions, mines, base } = event.data;
  if (action === "moveMinions") {
    const updatedMinions = minions.map((minion) => {
      if (minion.state === "goingToMine") {
        minion.moveTo(minion.assignedMine.x, minion.assignedMine.y);
        if (minion.x === minion.assignedMine.x && minion.y === minion.assignedMine.y) {
          minion.state = "returningToBase";
        }
      } else if (minion.state === "returningToBase") {
        minion.moveTo(base.x, base.y);
        if (minion.x === base.x && minion.y === base.y) {
          self.postMessage({ action: "deliverGold" });
          minion.state = "goingToMine";
        }
      }
      return minion;
    });
    
    self.postMessage({ action: "minionsMoved", updatedMinions });
  }
};
