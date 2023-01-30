import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";
import * as POSTPROCESSING from "postprocessing";

class Sketch extends kokomi.Base {
  async create() {
    const sc = new kokomi.ScreenCamera(this);
    sc.addExisting();

    new kokomi.OrbitControls(this);

    // gallery
    const ga = new kokomi.Gallery(this);
    ga.addExisting();

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
      intensity: 0.1,
      radius: 0.4,
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

    await ga.checkImagesLoaded();

    document.querySelector(".loader-screen").classList.add("hollow");
  }
}
