import * as THREE from "three";

import defaultVertexShader from "./shaders/vert.glsl";
import defaultFragmentShader from "./shaders/frag.glsl";

export interface GhibliToonMaterialConfig {
  colors: THREE.Color[];
  brightnessThresholds: number[];
  lightPosition: THREE.Vector3;
}

class GhibliToonMaterial extends THREE.ShaderMaterial {
  constructor(config: Partial<GhibliToonMaterialConfig> = {}) {
    const {
      colors = [
        new THREE.Color("#427062"),
        new THREE.Color("#33594E"),
        new THREE.Color("#234549"),
        new THREE.Color("#1E363F"),
      ],
      brightnessThresholds = [0.9, 0.45, 0.001],
      lightPosition = new THREE.Vector3(15, 15, 15),
    } = config;

    super({
      vertexShader: defaultVertexShader,
      fragmentShader: defaultFragmentShader,
      uniforms: {
        uColors: {
          value: colors,
        },
        uBrightnessThresholds: {
          value: brightnessThresholds,
        },
        uLightPosition: {
          value: lightPosition,
        },
      },
    });
  }
}

export { GhibliToonMaterial };
