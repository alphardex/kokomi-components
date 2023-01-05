import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const am = new kokomi.AssetManager(this, [
      {
        name: "tex",
        type: "cubeTexture",
        path: [
          "https://s2.loli.net/2022/11/02/AdySfoqhV8W5Fgr.png",
          "https://s2.loli.net/2022/11/02/raZmYvN5kC8gVdu.png",
          "https://s2.loli.net/2022/11/02/jhUc8kHMIxBwKSR.png",
          "https://s2.loli.net/2022/11/02/Dk6grUanARNLpOM.png",
          "https://s2.loli.net/2022/11/02/CwBdbtuMoQmKcjq.png",
          "https://s2.loli.net/2022/11/02/SrZMC3bDAd7xJwj.png",
        ],
      },
    ]);

    am.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");

      const tex = am.items["tex"];

      // liquid crystal
      const lc = new kokomiComponents.LiquidCrystal(this, tex);
      lc.addExisting();

      this.update(() => {
        lc.followMouse();
      });
    });
  }
}
