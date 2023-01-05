import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2.2);

    new kokomi.OrbitControls(this);

    const am = new kokomi.AssetManager(this, [
      {
        name: "tex",
        type: "texture",
        path: "https://s2.loli.net/2022/08/17/FOEp341XK8ns7AW.jpg",
      },
    ]);

    am.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");

      const tex = am.items["tex"];

      // grid icosahedron
      const gi = new kokomiComponents.GridIcosahedron(this, tex);
      gi.addExisting();

      this.update(() => {
        gi.autoRotate();
      });
    });
  }
}
