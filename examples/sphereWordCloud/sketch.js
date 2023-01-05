import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.z = 1.2;

    const controls = new kokomi.OrbitControls(this);
    controls.controls.autoRotate = true;

    // sphere word cloud
    const swcConfig = {
      radius: 0.5,
      segment: 5,
      pointSize: 0.01,
      pointOpacity: 1,
      pointColor: "white",
      lineOpacity: 1,
      lineColor: "white",
      baseClassName: "point",
    };
    const swc = new kokomiComponents.SphereWordCloud(this, swcConfig);
    swc.addExisting();
    swc.addHtmls();
    swc.addLines();
    swc.listenForHoverHtml(
      (el) => {
        controls.controls.autoRotate = false;
      },
      (el) => {
        controls.controls.autoRotate = true;
      }
    );
  }
}
