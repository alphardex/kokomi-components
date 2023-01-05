import * as kokomi from "kokomi.js";
import * as THREE from "three";

import defaultFragmentShader from "./shaders/frag.glsl";

export interface LiquidCrystalConfig {
  size: number;
  glow: number;
  mouse1Lerp: number;
  mouse2Lerp: number;
}

class LiquidCrystal extends kokomi.Component {
  sq: kokomi.ScreenQuad;
  mouse1Lerp: number;
  mouse2Lerp: number;
  offsetX1: number;
  offsetY1: number;
  offsetX2: number;
  offsetY2: number;
  constructor(
    base: kokomi.Base,
    texture: THREE.CubeTexture,
    config: Partial<LiquidCrystalConfig> = {}
  ) {
    super(base);

    const {
      size = 0.28,
      glow = 0.005,
      mouse1Lerp = 0.1,
      mouse2Lerp = 0.09,
    } = config;

    this.mouse1Lerp = mouse1Lerp;
    this.mouse2Lerp = mouse2Lerp;

    const sq = new kokomi.ScreenQuad(this.base, {
      shadertoyMode: true,
      fragmentShader: defaultFragmentShader,
      uniforms: {
        uMouse1: {
          value: new THREE.Vector2(0, 0),
        },
        uMouse2: {
          value: new THREE.Vector2(0, 0),
        },
        uSize: {
          value: size,
        },
        uAspect: {
          value: new THREE.Vector2(1, 1),
        },
        uCubemap: {
          value: null,
        },
      },
    });
    this.sq = sq;
    sq.material.transparent = true;
    sq.material.defines = {
      GLOW: glow,
    };

    sq.material.uniforms.uCubemap.value = texture;

    this.offsetX1 = 0;
    this.offsetY1 = 0;

    this.offsetX2 = 0;
    this.offsetY2 = 0;
  }
  addExisting(): void {
    this.sq.addExisting();
  }
  update(time: number): void {
    // aspect
    if (window.innerHeight / window.innerWidth > 1) {
      this.sq.material.uniforms.uAspect.value = new THREE.Vector2(
        window.innerWidth / window.innerHeight,
        1
      );
    } else {
      this.sq.material.uniforms.uAspect.value = new THREE.Vector2(
        1,
        window.innerHeight / window.innerWidth
      );
    }
  }
  followMouse() {
    const mouse = new THREE.Vector2(
      this.base.iMouse.mouseScreen.x / window.innerWidth,
      this.base.iMouse.mouseScreen.y / window.innerHeight
    );

    const mouse1Lerp = this.mouse1Lerp;
    const mouse2Lerp = this.mouse2Lerp;

    this.offsetX1 = THREE.MathUtils.lerp(this.offsetX1, mouse.x, mouse1Lerp);
    this.offsetY1 = THREE.MathUtils.lerp(this.offsetY1, mouse.y, mouse1Lerp);

    this.offsetX2 = THREE.MathUtils.lerp(
      this.offsetX2,
      this.offsetX1,
      mouse2Lerp
    );
    this.offsetY2 = THREE.MathUtils.lerp(
      this.offsetY2,
      this.offsetY1,
      mouse2Lerp
    );

    this.sq.material.uniforms.uMouse1.value = new THREE.Vector2(
      this.offsetX1,
      this.offsetY1
    );
    this.sq.material.uniforms.uMouse2.value = new THREE.Vector2(
      this.offsetX2,
      this.offsetY2
    );
  }
}

export { LiquidCrystal };
