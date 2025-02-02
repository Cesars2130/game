import GameController from "../application/GameController.js";

const GameUI = {
  initUI: function () {
    document.getElementById("buyMinionButton").addEventListener("click", () => {
      GameController.addMinion();
    });
  },

  startGame: function () {
    const canvas = document.getElementById("gameCanvas");
    GameController.init(canvas);
  }
};

export default GameUI;
