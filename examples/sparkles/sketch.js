import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    kokomi.enableRealisticRender(this.renderer);

    this.camera.position.set(4, 2, 4);
    this.camera.fov = 45;
    this.camera.updateProjectionMatrix();

    new kokomi.OrbitControls(this);

    // sparkles
    const sparklesConfig = {
      count: 30,
      size: 100,
      xRange: [-2, 2],
      yRange: [0, 1.5],
      zRange: [-2, 2],
      speed: 1,
      opacity: 1,
      color: new THREE.Color("#ffffff"),
    };
    const sparkles = new kokomiComponents.Sparkles(this, sparklesConfig);
    sparkles.addExisting();

    // objs
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshBasicMaterial({
        color: "#D5CEA3",
      })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.2;
    this.scene.add(plane);
  }
}
