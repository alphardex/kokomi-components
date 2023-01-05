import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 1.5);
    this.camera.fov = 10;
    this.camera.near = 0.01;
    this.camera.far = 10000;
    this.camera.updateProjectionMatrix();

    new kokomi.OrbitControls(this);

    const am = new kokomi.AssetManager(this, [
      {
        name: "tex",
        type: "texture",
        path: "https://s2.loli.net/2022/11/19/cqOho3ZKCXfTdzw.jpg",
      },
    ]);

    am.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");

      const tex = am.items["tex"];

      // fragment world
      const fw = new kokomiComponents.FragmentWorld(this);
      fw.addExisting();
      fw.changeTexture(tex);

      // RGBShift filter
      const rgbfConfig = {
        intensity: 1,
      };
      const rgbf = new kokomiComponents.RGBShiftFilter(this, rgbfConfig);
      rgbf.addExisting();
    });
  }
}
