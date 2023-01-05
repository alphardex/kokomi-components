import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    this.camera.fov = 60;
    this.camera.near = 0.1;
    this.camera.far = 10000;
    this.camera.updateProjectionMatrix();
    this.camera.position.z = -1000;

    // image tunnel
    const urls = [...Array(100).keys()].map((item, i) => {
      return `https://picsum.photos/id/${i}/100/100`;
      // return `https://s2.loli.net/2022/09/08/gGY4VloDAeUwWxt.jpg`;
    });

    const atConfig = {
      urls,
      speed: 1,
      imageSize: 5,
    };
    const at = new kokomiComponents.ImageTunnel(this, atConfig);
    at.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");
    });
    await at.addExisting();
  }
}
