import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import * as kokomiComponents from "kokomi-components";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 4);

    new kokomi.OrbitControls(this);

    const am = new kokomi.AssetManager(this, [
      {
        name: "tex",
        type: "texture",
        path: "https://s2.loli.net/2022/12/04/lNdGHYIazT4mfcC.png",
      },
    ]);

    am.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");

      const tex = am.items["tex"];

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

      // pencil filter
      const pfConfig = {
        texture: tex,
        pencilColor: "#521F33",
        bgColor: "#ffffff",
      };
      const pf = new kokomiComponents.PencilFilter(this, pfConfig);
      pf.addExisting();
    });
  }
}
