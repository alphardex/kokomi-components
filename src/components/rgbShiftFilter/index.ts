import * as kokomi from "kokomi.js";
import * as THREE from "three";

import defaultVertexShader from "./shaders/vert.glsl";
import defaultFragmentShader from "./shaders/frag.glsl";

export interface RGBShiftFilterConfig {
  intensity: number;
}

class RGBShiftFilter extends kokomi.Component {
  ce: kokomi.CustomEffect;
  constructor(base: kokomi.Base, config: Partial<RGBShiftFilterConfig> = {}) {
    super(base);

    const { intensity = 1 } = config;

    const ce = new kokomi.CustomEffect(base, {
      vertexShader: defaultVertexShader,
      fragmentShader: defaultFragmentShader,
      uniforms: {
        uIntensity: {
          value: intensity,
        },
      },
    });
    this.ce = ce;
  }
  addExisting(): void {
    this.ce.addExisting();
  }
}

export { RGBShiftFilter };
