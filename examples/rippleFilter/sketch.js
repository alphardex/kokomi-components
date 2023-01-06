import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    const sc = new kokomi.ScreenCamera(this);
    sc.addExisting();

    new kokomi.OrbitControls(this);

    const am = new kokomi.AssetManager(this, [
      {
        name: "tex",
        type: "texture",
        path: "https://s2.loli.net/2022/08/09/nztMbdORvp5o2CJ.png",
      },
    ]);

    am.on("ready", async () => {
      const tex = am.items["tex"];

      // gallery
      const ga = new kokomi.Gallery(this);
      ga.addExisting();

      // ripple filter
      const rfConfig = {
        texture: tex,
        waveCount: 100,
        intensity: 1,
      };
      const rf = new kokomiComponents.RippleFilter(this, rfConfig);
      rf.addExisting();

      await ga.checkImagesLoaded();

      document.querySelector(".loader-screen").classList.add("hollow");
    });
  }
}
