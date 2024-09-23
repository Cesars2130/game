import Resources from "./domain/Resources.js";
import GameUI from "./ui/GameUI.js";

Resources.loadResources(
  [
    { name: "minion", path: "./assets/minion.png", type: "image" },
    { name: "mine", path: "./assets/mine.png", type: "image" },
    { name: "base", path: "./assets/base.png", type: "image" },
    { name: "gold", path: "./assets/gold.png", type: "image" },
    { name: "cashRegister", path: "./assets/cachin.mp3", type: "sound" },
    { name: "bg", path: "./assets/bg.jpg", type: "image" },
  ],
  () => {
    GameUI.initUI();
    GameUI.startGame();
  }
);
