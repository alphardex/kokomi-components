import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    const sc = new kokomi.ScreenCamera(this);
    sc.addExisting();

    new kokomi.OrbitControls(this);

    // checkerboard text
    const fontUrl = "../../assets/HYWenHei-85W.ttf";

    await kokomi.preloadSDFFont(fontUrl);

    document.querySelector(".loader-screen").classList.add("hollow");

    const ctConfig = {
      shadowColor: "#03D8F3",
      textColor: "#ffffff",
      textSpacing: 0.05,
      grid: [3, 6],
      font: fontUrl,
      elList: [...document.querySelectorAll(".ct")],
    };
    const ct = new kokomiComponents.CheckerboardText(this, ctConfig);
    ct.addExisting();
    ct.fadeIn("ct-1", {
      duration: 1.6,
      stagger: 0.05,
      delay: 0,
    });
  }
}
