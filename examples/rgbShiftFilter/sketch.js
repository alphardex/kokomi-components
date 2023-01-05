import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(2, 2, 2);

    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this, { width: 1, height: 1, depth: 1 });
    box.addExisting();

    // RGBShift filter
    const rgbfConfig = {
      intensity: 2,
    };
    const rgbf = new kokomiComponents.RGBShiftFilter(this, rgbfConfig);
    rgbf.addExisting();
  }
}
