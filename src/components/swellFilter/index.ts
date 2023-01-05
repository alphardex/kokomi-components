import * as kokomi from "kokomi.js";
import * as THREE from "three";

import defaultVertexShader from "./shaders/vert.glsl";
import defaultFragmentShader from "./shaders/frag.glsl";

export interface SwellFilterConfig {
  intensity: number;
}

class SwellFilter extends kokomi.Component {
  ce: kokomi.CustomEffect;
  progress: number;
  constructor(base: kokomi.Base, config: Partial<SwellFilterConfig> = {}) {
    super(base);

    const { intensity = 1 } = config;

    const ce = new kokomi.CustomEffect(base, {
      vertexShader: defaultVertexShader,
      fragmentShader: defaultFragmentShader,
      uniforms: {
        uProgress: {
          value: 0,
        },
        uIntensity: {
          value: intensity,
        },
      },
    });
    this.ce = ce;

    this.progress = 0;
  }
  addExisting(): void {
    this.ce.addExisting();
  }
  update() {
    const pr = this.progress;
    this.ce.customPass.material.uniforms.uProgress.value = pr;
  }
  linkScroll(delta: number) {
    const scrollSpeed = Math.abs(delta / 50);
    this.progress = THREE.MathUtils.lerp(this.progress, scrollSpeed, 0.1);
  }
}

export { SwellFilter };
