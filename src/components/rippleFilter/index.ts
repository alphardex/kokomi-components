import * as kokomi from "kokomi.js";
import * as THREE from "three";

import defaultVertexShader from "./shaders/vert.glsl";
import defaultFragmentShader from "./shaders/frag.glsl";

export interface RippleFilterConfig {
  texture: THREE.Texture;
  waveCount: number;
  intensity: number;
}

class RippleFilter extends kokomi.Component {
  ce: kokomi.CustomEffect;
  constructor(base: kokomi.Base, config: Partial<RippleFilterConfig> = {}) {
    super(base);

    const {
      texture = new THREE.TextureLoader().load(
        "https://s2.loli.net/2022/08/09/nztMbdORvp5o2CJ.png"
      ),
      waveCount = 100,
      intensity = 1,
    } = config;

    // ripple displacement renderTexture
    const createRippleRt = () => {
      const rt = new kokomi.RenderTexture(this.base, {
        rtCamera: this.base.camera,
      });

      let currentWave = 0;

      const geometry = new THREE.PlaneGeometry(64, 64);

      const ripples: THREE.Mesh[] = [];
      for (let i = 0; i < waveCount; i++) {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
        });

        const ripple = new THREE.Mesh(geometry, material);
        rt.add(ripple);
        ripples.push(ripple);
        ripple.visible = false;
        ripple.rotation.z = 2 * Math.PI * Math.random();
      }

      this.base.update(() => {
        if (this.base.iMouse.isMouseMoving) {
          currentWave = (currentWave + 1) % waveCount;

          let activeRipple = ripples[currentWave];
          activeRipple.visible = true;
          activeRipple.position.x = this.base.iMouse.mouseScreen.x;
          activeRipple.position.y = this.base.iMouse.mouseScreen.y;
          (activeRipple.material as THREE.MeshBasicMaterial).opacity = 0.5;
          activeRipple.scale.x = 0.2;
          activeRipple.scale.y = 0.2;
        }

        ripples.forEach((ripple) => {
          if (!ripple.visible) {
            return;
          }
          ripple.rotation.z += 0.02;
          (ripple.material as THREE.MeshBasicMaterial).opacity *= 0.96;
          ripple.scale.x = 0.982 * ripple.scale.x + 0.108;
          ripple.scale.y = ripple.scale.x;
          if ((ripple.material as THREE.MeshBasicMaterial).opacity < 0.002) {
            ripple.visible = false;
          }
        });
      });

      return rt;
    };

    const rippleRt = createRippleRt();

    const ce = new kokomi.CustomEffect(base, {
      vertexShader: defaultVertexShader,
      fragmentShader: defaultFragmentShader,
      uniforms: {
        uIntensity: {
          value: intensity,
        },
        uDisplacement: {
          value: null,
        },
      },
    });
    this.ce = ce;

    ce.customPass.material.uniforms.uDisplacement.value = rippleRt.texture;
  }
  addExisting(): void {
    this.ce.addExisting();
  }
}

export { RippleFilter };
