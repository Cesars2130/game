export class ResourceLoader {
    static loadImages(sources, callback) {
      let loadedImages = 0;
      const images = {};
  
      sources.forEach((source) => {
        const img = new Image();
        img.src = source.path;
        img.onload = () => {
          images[source.name] = img;
          loadedImages++;
          if (loadedImages === sources.length) {
            callback(images);
          }
        };
      });
    }
  
    static loadSounds(sources) {
      // Implementación para cargar sonidos si es necesario
    }
  }
  