import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(2, 2, 2);

    new kokomi.OrbitControls(this);

    const am = new kokomi.AssetManager(this, [
      {
        name: "tex",
        type: "texture",
        path: "https://s2.loli.net/2022/12/04/lNdGHYIazT4mfcC.png",
      },
    ]);

    am.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");

      const tex = am.items["tex"];

      const box = new kokomi.Box(this, { width: 1, height: 1, depth: 1 });
      box.addExisting();

      // pencil filter
      const pfConfig = {
        texture: tex,
        pencilColor: "#521F33",
        bgColor: "#ffffff",
      };
      const pf = new kokomiComponents.PencilFilter(this, pfConfig);
      pf.addExisting();
    });
  }
}
