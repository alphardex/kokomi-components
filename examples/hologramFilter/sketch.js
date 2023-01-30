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

    const am = new kokomi.AssetManager(this, [
      {
        name: "hdrTex",
        type: "texture",
        path: "https://s2.loli.net/2023/01/30/OK1mr65Hw9Pdk4Z.png",
      },
    ]);

    am.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");

      // scene
      const envMap = kokomi.getEnvmapFromHDRTexture(
        this.renderer,
        am.items["hdrTex"]
      );

      const mesh = new THREE.Mesh(
        new THREE.TorusKnotGeometry(),
        new THREE.MeshStandardMaterial({
          envMap,
          metalness: 0.5,
          roughness: 0.3,
        })
      );
      this.scene.add(mesh);

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
        intensity: 1.5,
        radius: 0.6,
      });
      composer.addPass(new POSTPROCESSING.EffectPass(this.camera, bloom));

      // hologram filter
      const hfConfig = {
        progress: 1,
        glowColor: new THREE.Color("#66ccff"),
        glowColorStrength: 0.4,
      };
      const hf = new kokomiComponents.HologramFilter(hfConfig);
      composer.addPass(new POSTPROCESSING.EffectPass(this.camera, hf));
    });
  }
}
