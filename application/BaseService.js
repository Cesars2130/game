const BaseService = {
    deliverGold: function (minion) {
      if (!minion.carryingGold) {
        minion.carryingGold = true;
      }
    },
  
    depositGold: function () {
      const GameController = require("./GameController").default;
      GameController.score += GameController.goldPerDelivery;
      GameController.updateGoldCount();
      
      // Reproducir sonido al depositar el oro
      const sound = GameController.sounds["cashRegister"];
      sound.play();
    }
  };
  
  export default BaseService;
  