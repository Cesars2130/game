const Resources = {
    images: {},
    sounds: {},
    currentSkins: {
      minion: "minion.png",
      mine: "mine.png",
      base: "base.png",
    },
    
    loadResource: function (source) {
      return new Promise((resolve, reject) => {
        if (source.type === "image") {
          const img = new Image();
          img.src = source.path;
          img.onload = () => {
            Resources.images[source.name] = img;
            resolve();
          };
          img.onerror = reject;
        } else if (source.type === "sound") {
          const audio = new Audio(source.path);
          Resources.sounds[source.name] = audio;
          resolve();
        }
      });
    },
  
    loadResources: async function (sources, callback) {
      try {
        await Promise.all(sources.map(this.loadResource));
        callback();
      } catch (error) {
        console.error("Error al cargar recursos:", error);
      }
    }
  };
  
  export default Resources;
  