import * as kokomi from "kokomi.js";
import * as THREE from "three";

import defaultVertexShader from "./shaders/vert.glsl";
import defaultFragmentShader from "./shaders/frag.glsl";

export interface PencilFilterConfig {
  texture: THREE.Texture;
  pencilColor: string;
  bgColor: string;
}

class PencilFilter extends kokomi.Component {
  ce: kokomi.CustomEffect;
  normalFBO: kokomi.FBO;
  constructor(base: kokomi.Base, config: Partial<PencilFilterConfig> = {}) {
    super(base);

    const {
      texture = new THREE.TextureLoader().load(
        "https://s2.loli.net/2022/12/04/lNdGHYIazT4mfcC.png"
      ),
      pencilColor = "#521F33",
      bgColor = "#ffffff",
    } = config;

    const ce = new kokomi.CustomEffect(base, {
      vertexShader: defaultVertexShader,
      fragmentShader: defaultFragmentShader,
      uniforms: {
        tNormals: {
          value: null,
        },
        uTexture: {
          value: texture,
        },
        uPencilColor: {
          value: new THREE.Color(pencilColor),
        },
        uBgColor: {
          value: new THREE.Color(bgColor),
        },
      },
    });
    this.ce = ce;

    const normalFBO = new kokomi.FBO(this.base);
    normalFBO.rt.texture.type = THREE.HalfFloatType;
    normalFBO.rt.texture.minFilter = THREE.NearestFilter;
    normalFBO.rt.texture.magFilter = THREE.NearestFilter;
    this.normalFBO = normalFBO;
  }
  addExisting(): void {
    this.ce.addExisting();
  }
  update(time: number): void {
    this.base.renderer.setRenderTarget(this.normalFBO.rt);

    const om = this.container.overrideMaterial;
    this.container.overrideMaterial = new THREE.MeshNormalMaterial();
    const rtScene = this.container;
    const rtCamera = this.base.camera;
    this.base.renderer.render(rtScene, rtCamera);
    this.container.overrideMaterial = om;

    this.ce.customPass.material.uniforms.tNormals.value =
      this.normalFBO.rt.texture;

    this.base.renderer.setRenderTarget(null);
  }
}

export { PencilFilter };
