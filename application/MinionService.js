import GameController from "./GameController.js";

const MinionService = {
  assignMinion: function () {
    GameController.addMinion();
  },

  moveMinions: function () {
    GameController.minions.forEach((minion) => {
      if (minion.state === "goingToMine") {
        minion.moveTo(minion.assignedMine.x, minion.assignedMine.y);
      } else if (minion.state === "returningToBase") {
        minion.moveTo(GameController.base.x, GameController.base.y);
      }
    });
  }
};

export default MinionService;
