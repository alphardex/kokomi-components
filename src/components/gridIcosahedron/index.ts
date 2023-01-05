import * as kokomi from "kokomi.js";
import * as THREE from "three";

import shapeVertexShader from "./shaders/shape/vert.glsl";
import shapeFragmentShader from "./shaders/shape/frag.glsl";
import edgeVertexShader from "./shaders/edge/vert.glsl";
import edgeFragmentShader from "./shaders/edge/frag.glsl";

class GridIcosahedron extends kokomi.Component {
  uj: kokomi.UniformInjector;
  ico: THREE.Group;
  materialShape: THREE.ShaderMaterial;
  materialEdge: THREE.ShaderMaterial;
  shapeMesh: THREE.Mesh;
  edgeMesh: THREE.Mesh;
  constructor(base: kokomi.Base, texture: THREE.Texture) {
    super(base);

    this.uj = new kokomi.UniformInjector(this.base);

    const ico = new THREE.Group();
    this.container.add(ico);
    this.ico = ico;

    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;

    const geometryShape = new THREE.IcosahedronGeometry(1, 1);
    const materialShape = new THREE.ShaderMaterial({
      vertexShader: shapeVertexShader,
      fragmentShader: shapeFragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        ...this.uj.shadertoyUniforms,
        ...{
          uTexture: {
            value: texture,
          },
          uRefractionStrength: {
            value: 0,
          },
          uRandomEnabled: {
            value: 1,
          },
          uNoiseDensity: {
            value: 0,
          },
        },
      },
    });
    this.materialShape = materialShape;
    const shapeMesh = new THREE.Mesh(geometryShape, materialShape);
    this.shapeMesh = shapeMesh;

    const geometryEdge = new THREE.IcosahedronGeometry(1.001, 1);
    kokomi.getBaryCoord(geometryEdge);
    const materialEdge = new THREE.ShaderMaterial({
      vertexShader: edgeVertexShader,
      fragmentShader: edgeFragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        ...this.uj.shadertoyUniforms,
        ...{
          uWidth: {
            value: 1,
          },
          uNoiseDensity: {
            value: 0,
          },
        },
      },
    });
    this.materialEdge = materialEdge;
    const edgeMesh = new THREE.Mesh(geometryEdge, materialEdge);
    this.edgeMesh = edgeMesh;
  }
  addExisting(): void {
    this.ico.add(this.shapeMesh);
    this.ico.add(this.edgeMesh);
  }
  update(time: number): void {
    if (this.uj) {
      this.uj.injectShadertoyUniforms(this.materialShape.uniforms);
      this.uj.injectShadertoyUniforms(this.materialEdge.uniforms);
    }
  }
  autoRotate() {
    const t = this.base.clock.elapsedTime;

    this.ico.rotation.x = t / 15;
    this.ico.rotation.y = t / 15;
  }
}

export { GridIcosahedron };
