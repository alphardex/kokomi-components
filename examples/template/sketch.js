import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(2, 2, 2);

    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this, { width: 0.5, height: 0.5, depth: 0.5 });
    box.addExisting();
  }
}
