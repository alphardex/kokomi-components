import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";
import * as POSTPROCESSING from "postprocessing";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 4);

    new kokomi.OrbitControls(this);

    // scene
    const mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(),
      new THREE.MeshStandardMaterial({
        color: "#444444",
      })
    );
    this.scene.add(mesh);

    const ambiLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);

    // postprocessing
    this.scene.background = new THREE.Color("#000000");

    const composer = new POSTPROCESSING.EffectComposer(this.renderer);
    this.composer = composer;

    composer.addPass(new POSTPROCESSING.RenderPass(this.scene, this.camera));

    // bloom
    const bloom = new POSTPROCESSING.BloomEffect({
      luminanceThreshold: 0.05,
      luminanceSmoothing: 0,
      mipmapBlur: true,
      intensity: 1.2,
      radius: 0.6,
    });
    composer.addPass(new POSTPROCESSING.EffectPass(this.camera, bloom));

    // hologram filter
    const hfConfig = {
      progress: 1,
      glowColor: new THREE.Color("#66ccff"),
      glowColorStrength: 0.8,
    };
    const hf = new kokomiComponents.HologramFilter(hfConfig);
    composer.addPass(new POSTPROCESSING.EffectPass(this.camera, hf));
  }
}
