import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 4);

    new kokomi.OrbitControls(this);

    kokomi.beautifyRender(this.renderer);

    const geo = new THREE.TorusKnotGeometry();

    const gbMat = new kokomiComponents.GhibliToonMaterial({
      colors: [
        new THREE.Color("#427062"),
        new THREE.Color("#33594E"),
        new THREE.Color("#234549"),
        new THREE.Color("#1E363F"),
      ],
      brightnessThresholds: [0.9, 0.45, 0.001],
      lightPosition: new THREE.Vector3(15, 15, 15),
    });

    const mesh = new THREE.Mesh(geo, gbMat);
    this.scene.add(mesh);
  }
}
