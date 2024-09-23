const MineService = {
    extractGold: function (mine) {
      if (mine.hasGold) {
        mine.extractGold();
        return true;
      }
      return false;
    }
  };
  
  export default MineService;
  