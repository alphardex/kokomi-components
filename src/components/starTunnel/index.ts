import * as kokomi from "kokomi.js";
import * as THREE from "three";

import defaultVertexShader from "./shaders/vert.glsl";
import defaultFragmentShader from "./shaders/frag.glsl";

export interface StarTunnelConfig {
  count: number;
  pointColor1: string;
  pointColor2: string;
  pointSize: number;
  angularVelocity: number;
  velocity: number;
  vertexShader: string;
  fragmentShader: string;
}

class StarTunnel extends kokomi.Component {
  count: number;
  pointColor1: string;
  pointColor2: string;
  pointSize: number;
  angularVelocity: number;
  velocity: number;
  vertexShader: string;
  fragmentShader: string;
  uj: kokomi.UniformInjector;
  geometry: THREE.BufferGeometry | null;
  material: THREE.ShaderMaterial | null;
  points: THREE.Points | null;
  constructor(base: kokomi.Base, config: Partial<StarTunnelConfig> = {}) {
    super(base);

    const {
      count = 10000,
      pointColor1 = "#ff6030",
      pointColor2 = "#1b3984",
      pointSize = 3,
      angularVelocity = 0,
      velocity = 0.01,
      vertexShader = defaultVertexShader,
      fragmentShader = defaultFragmentShader,
    } = config;

    this.count = count;
    this.pointColor1 = pointColor1;
    this.pointColor2 = pointColor2;
    this.pointSize = pointSize;
    this.angularVelocity = angularVelocity;
    this.velocity = velocity;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    this.uj = new kokomi.UniformInjector(this.base);
    this.geometry = null;
    this.material = null;
    this.points = null;

    this.create();
  }
  create() {
    this.dispose();

    const geometry = new THREE.BufferGeometry();
    this.geometry = geometry;

    const positions = kokomi.makeBuffer(
      this.count,
      () => THREE.MathUtils.randFloat(-0.5, 0.5) * 50
    );
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const seeds = kokomi.makeBuffer(
      this.count,
      () => THREE.MathUtils.randFloat(0, 1),
      2
    );
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 2));

    const sizes = kokomi.makeBuffer(
      this.count,
      () => this.pointSize + THREE.MathUtils.randFloat(0, 1),
      1
    );
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        ...this.uj.shadertoyUniforms,
        ...{
          iColor1: {
            value: new THREE.Color(this.pointColor1),
          },
          iColor2: {
            value: new THREE.Color(this.pointColor2),
          },
          iVelocity: {
            value: this.velocity,
          },
        },
      },
    });
    this.material = material;

    const points = new THREE.Points(geometry, material);
    this.points = points;

    this.changePos();
  }
  addExisting() {
    if (this.points) {
      this.container.add(this.points);
    }
  }
  update(time: number) {
    if (this.points) {
      this.points.rotation.z += this.angularVelocity * 0.01;
    }
    if (this.uj && this.material) {
      this.uj.injectShadertoyUniforms(this.material.uniforms);
    }
  }
  changePos() {
    if (this.geometry) {
      const positionAttrib = this.geometry.attributes.position;

      kokomi.iterateBuffer(
        positionAttrib.array,
        this.count,
        (arr: number[], axis: THREE.Vector3) => {
          const theta = THREE.MathUtils.randFloat(0, 360);
          const r = THREE.MathUtils.randFloat(10, 50);
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);
          const z = THREE.MathUtils.randFloat(0, 2000);
          arr[axis.x] = x;
          arr[axis.y] = y;
          arr[axis.z] = z;
        }
      );
    }
  }
  dispose() {
    if (this.geometry) {
      this.geometry.dispose();
    }

    if (this.material) {
      this.material.dispose();
    }

    if (this.points) {
      this.container.remove(this.points);
    }
  }
}

export { StarTunnel };
