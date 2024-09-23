import { ResourceLoader } from "../infrastructure/ResourceLoader.js";

export class ResourceService {
  static loadResources(callback) {
    const sources = [
      { name: "minion", path: "assets/minion.png", type: "image" },
      { name: "mine", path: "assets/mine.png", type: "image" },
      { name: "base", path: "assets/base.png", type: "image" },
      { name: "gold", path: "assets/gold.png", type: "image" },
      { name: "cashRegister", path: "assets/cachin.mp3", type: "sound" },
    ];

    ResourceLoader.loadImages(sources, callback);
  }
}
