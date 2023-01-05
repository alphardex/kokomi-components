import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera = camera;
    this.interactionManager.camera = camera;
    camera.position.z = 1000;

    // new kokomi.OrbitControls(this);

    // star tunnel
    const stConfig = {
      count: 10000,
      pointColor1: "#2155CD",
      pointColor2: "#FF4949",
      pointSize: 3,
      angularVelocity: 0,
      velocity: 0.01,
    };
    const st = new kokomiComponents.StarTunnel(this, stConfig);
    st.addExisting();

    // persistence effect
    const pe = new kokomi.PersistenceEffect(this);
    pe.addExisting();
  }
}
