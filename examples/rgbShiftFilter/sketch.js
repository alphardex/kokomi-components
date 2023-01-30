import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 4);

    new kokomi.OrbitControls(this);

    // scene
    const mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(),
      new THREE.MeshStandardMaterial({
        color: "#888888",
      })
    );
    this.scene.add(mesh);

    const ambiLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);

    // RGBShift filter
    const rgbfConfig = {
      intensity: 3,
    };
    const rgbf = new kokomiComponents.RGBShiftFilter(this, rgbfConfig);
    rgbf.addExisting();
  }
}
