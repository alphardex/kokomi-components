import * as THREE from "three";

// https://github.com/pmndrs/postprocessing/issues/364#issuecomment-1104400804
// import * as POSTPROCESSING from "postprocessing";
// @ts-ignore
import * as POSTPROCESSING from "../../libs/postprocessing.esm.js";

import defaultFragmentShader from "./shaders/frag.glsl";

class HologramFilter extends POSTPROCESSING.Effect {
  constructor({
    blendFunction = POSTPROCESSING.BlendFunction.NORMAL,
    progress = 1,
    glowColor = new THREE.Color("#66ccff"),
    glowColorStrength = 0.3,
  }) {
    super("HologramFilter", defaultFragmentShader, {
      uniforms: new Map([
        ["uProgress", new THREE.Uniform(progress)],
        ["uGlowColor", new THREE.Uniform(glowColor)],
        ["uGlowColorStrength", new THREE.Uniform(glowColorStrength)],
      ]),
      blendFunction,
    });
  }
}

export { HologramFilter };
