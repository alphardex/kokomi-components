import * as kokomi from "kokomi.js";
import * as THREE from "three";

import defaultVertexShader from "./shaders/vert.glsl";
import defaultFragmentShader from "./shaders/frag.glsl";

export interface SparklesConfig {
  count: number;
  size: number;
  xRange: number[];
  yRange: number[];
  zRange: number[];
  speed: number;
  opacity: number;
  color: THREE.Color;
  vertexShader: string;
  fragmentShader: string;
}

class Sparkles extends kokomi.Component {
  uj: kokomi.UniformInjector;
  sparkles: THREE.Points;
  constructor(base: kokomi.Base, config: Partial<SparklesConfig> = {}) {
    super(base);

    const {
      count = 30,
      size = 100,
      xRange = [-2, 2],
      yRange = [0, 1.5],
      zRange = [-2, 2],
      speed = 1,
      opacity = 1,
      color = new THREE.Color("#ffffff"),
      vertexShader = defaultVertexShader,
      fragmentShader = defaultFragmentShader,
    } = config;

    const geo = new THREE.BufferGeometry();
    const posBuffer = kokomi.makeBuffer(
      count,
      (val: number) => Math.random() * 4
    );
    kokomi.iterateBuffer(
      posBuffer,
      posBuffer.length,
      (arr: number[], axis: THREE.Vector3) => {
        arr[axis.x] = THREE.MathUtils.randFloat(xRange[0], xRange[1]);
        arr[axis.y] = THREE.MathUtils.randFloat(yRange[0], yRange[1]);
        arr[axis.z] = THREE.MathUtils.randFloat(zRange[0], zRange[1]);
      }
    );
    geo.setAttribute("position", new THREE.BufferAttribute(posBuffer, 3));
    const pIndexBuffer = kokomi.makeBuffer(count / 3, (val: number) => val);
    geo.setAttribute("pIndex", new THREE.BufferAttribute(pIndexBuffer, 1));

    const uj = new kokomi.UniformInjector(this.base);
    this.uj = uj;

    const sparklesMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...uj.shadertoyUniforms,
        ...{
          uPixelRatio: {
            value: Math.min(window.devicePixelRatio, 2),
          },
          uPointSize: {
            value: size,
          },
          uSpeed: {
            value: speed,
          },
          uOpacity: {
            value: opacity,
          },
          uColor: {
            value: color,
          },
        },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sparkles = new THREE.Points(geo, sparklesMat);
    this.sparkles = sparkles;

    window.addEventListener("resize", () => {
      sparkles.material.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2
      );
    });
  }
  addExisting(): void {
    this.container.add(this.sparkles);
  }
  update(time: number): void {
    if (this.sparkles) {
      const mat = this.sparkles.material as THREE.ShaderMaterial;
      this.uj.injectShadertoyUniforms(mat.uniforms);
    }
  }
}

export { Sparkles };
