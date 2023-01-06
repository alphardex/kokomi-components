import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";

import defaultVertexShader from "./shaders/vert.glsl";
import defaultFragmentShader from "./shaders/frag.glsl";

export interface FragmentConfig {
  material: THREE.ShaderMaterial;
  points: THREE.Vector2[];
}

const defaultMaterial = new THREE.ShaderMaterial({
  vertexShader: defaultVertexShader,
  fragmentShader: defaultFragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: {
    uTexture: {
      value: null,
    },
    uLightPosition: {
      value: new THREE.Vector3(-0.2, -0.2, 3),
    },
    uLightColor: {
      value: new THREE.Color("#eeeeee"),
    },
    uRandom: {
      value: THREE.MathUtils.randFloat(0.1, 1.1),
    },
    uMouse: {
      value: new THREE.Vector2(0.5, 0.5),
    },
    uLayerId: {
      value: 0,
    },
  },
});

class Fragment extends kokomi.Component {
  points: THREE.Vector2[];
  mesh: THREE.Mesh;
  uj: kokomi.UniformInjector;
  constructor(base: kokomi.Base, config: Partial<FragmentConfig> = {}) {
    super(base);

    const { material, points = [] } = config;

    this.points = kokomi.polySort(points) as THREE.Vector2[];

    const shape = kokomi.createPolygonShape(this.points, {
      scale: 0.01,
    });
    const geometry = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: 0.0001,
      bevelEnabled: true,
      bevelThickness: 0.0005,
      bevelSize: 0.0005,
      bevelSegments: 1,
    });
    geometry.center();

    const matClone = material?.clone();
    if (matClone) {
      matClone.uniforms.uRandom.value = THREE.MathUtils.randFloat(0.1, 1.1);
    }

    const mesh = new THREE.Mesh(geometry, matClone);
    this.mesh = mesh;

    const uj = new kokomi.UniformInjector(this.base);
    this.uj = uj;
  }
  addExisting() {
    this.container.add(this.mesh);
  }
  update() {
    const mat = this.mesh.material as THREE.ShaderMaterial;
    this.uj.injectShadertoyUniforms(mat.uniforms);
    gsap.to(mat.uniforms.uMouse.value, {
      x: this.base.interactionManager.mouse.x,
    });
    gsap.to(mat.uniforms.uMouse.value, {
      y: this.base.interactionManager.mouse.y,
    });

    const lp = this.base.clock.elapsedTime * 0.01;
    mat.uniforms.uLightPosition.value.copy(
      new THREE.Vector3(Math.cos(lp), Math.sin(lp), 10)
    );
  }
}

export interface FragmentGroupConfig {
  material: THREE.ShaderMaterial;
  layerId: number;
  polygons: THREE.Vector2[][];
}

class FragmentGroup extends kokomi.Component {
  g: THREE.Group;
  frags: Fragment[];
  constructor(base: kokomi.Base, config: Partial<FragmentGroupConfig> = {}) {
    super(base);

    const { material, layerId = 0, polygons } = config;

    const g = new THREE.Group();
    this.g = g;

    const frags = polygons?.map((points, i) => {
      const frag = new Fragment(this.base, {
        material,
        points,
      });
      frag.container = this.container;
      frag.addExisting();
      const firstPoint = frag.points[0];
      frag.mesh.position.set(
        firstPoint.x * 0.01,
        firstPoint.y * -0.01,
        THREE.MathUtils.randFloat(-3, -1)
      );
      (frag.mesh.material as THREE.ShaderMaterial).uniforms.uLayerId.value =
        layerId;
      g.add(frag.mesh);
      return frag;
    });

    this.g.position.z = 2 - 1.5 * layerId;

    this.frags = frags!;
  }
  addExisting() {
    this.container.add(this.g);
  }
}

export interface GeneratePolygonsConfig {
  gridX: number;
  gridY: number;
  maxX: number;
  maxY: number;
}

const generatePolygons = (config: Partial<GeneratePolygonsConfig> = {}) => {
  const { gridX = 10, gridY = 20, maxX = 9, maxY = 9 } = config;

  const polygons = [];

  for (let i = 0; i < gridX; i++) {
    for (let j = 0; j < gridY; j++) {
      const points = [];
      let edgeCount = 3;
      const randEdgePossibility = Math.random();
      if (randEdgePossibility > 0 && randEdgePossibility <= 0.2) {
        edgeCount = 3;
      } else if (randEdgePossibility > 0.2 && randEdgePossibility <= 0.55) {
        edgeCount = 4;
      } else if (randEdgePossibility > 0.55 && randEdgePossibility <= 0.9) {
        edgeCount = 5;
      } else if (randEdgePossibility > 0.9 && randEdgePossibility <= 0.95) {
        edgeCount = 6;
      } else if (randEdgePossibility > 0.95 && randEdgePossibility <= 1) {
        edgeCount = 7;
      }
      let firstPoint = {
        x: 0,
        y: 0,
      };
      let angle = THREE.MathUtils.randFloat(0, 2 * Math.PI);
      for (let k = 0; k < edgeCount; k++) {
        if (k === 0) {
          firstPoint = {
            x: (i % maxX) * 10,
            y: (j % maxY) * 10,
          };
          points.push(firstPoint);
        } else {
          // random polar
          const r = 10;
          angle += THREE.MathUtils.randFloat(0, Math.PI / 2);
          const anotherPoint = {
            x: firstPoint.x + r * Math.cos(angle),
            y: firstPoint.y + r * Math.sin(angle),
          };
          points.push(anotherPoint);
        }
      }
      polygons.push(points);
    }
  }

  return polygons;
};

export interface FragmentWorldConfig {
  material: THREE.ShaderMaterial;
  isShadertoyUniformInjected: boolean;
}

class FragmentWorld extends kokomi.Component {
  material: THREE.ShaderMaterial;
  uj: kokomi.UniformInjector;
  isShadertoyUniformInjected: boolean;
  fgs: FragmentGroup[];
  totalG: THREE.Group;
  floatDistance: number;
  floatSpeed: number;
  floatMaxDistance: number;
  isDashing: boolean;
  constructor(base: kokomi.Base, config: Partial<FragmentWorldConfig> = {}) {
    super(base);

    const { material = defaultMaterial, isShadertoyUniformInjected = true } =
      config;

    this.material = material;
    this.uj = new kokomi.UniformInjector(this.base);
    this.isShadertoyUniformInjected = isShadertoyUniformInjected;
    if (isShadertoyUniformInjected) {
      material.uniforms = {
        ...material.uniforms,
        ...this.uj.shadertoyUniforms,
      };
    }

    const fgsContainer = new THREE.Group();
    this.container.add(fgsContainer);
    fgsContainer.position.copy(new THREE.Vector3(-0.36, 0.36, 0.1));

    // fragment groups
    const polygons = generatePolygons();

    const fgs = [...Array(2).keys()].map((item, i) => {
      const fg = new FragmentGroup(this.base, {
        material,
        layerId: i,
        // @ts-ignore
        polygons,
      });
      fg.container = this.container;
      fg.addExisting();
      fgsContainer.add(fg.g);
      return fg;
    });
    this.fgs = fgs;

    // clone group for infinite loop
    const fgsContainer2 = new THREE.Group().copy(fgsContainer.clone());
    fgsContainer2.position.y = fgsContainer.position.y - 1;

    const totalG = new THREE.Group();
    totalG.add(fgsContainer);
    totalG.add(fgsContainer2);
    this.totalG = totalG;

    // anime
    this.floatDistance = 0;
    this.floatSpeed = 1;
    this.floatMaxDistance = 1;
    this.isDashing = false;
  }
  addExisting() {
    this.container.add(this.totalG);
  }
  update() {
    if (this.isShadertoyUniformInjected) {
      this.uj.injectShadertoyUniforms(this.material.uniforms);
    }

    this.floatDistance += this.floatSpeed;

    const y = this.floatDistance * 0.001;
    if (y > this.floatMaxDistance) {
      this.floatDistance = 0;
    }
    if (this.totalG) {
      this.totalG.position.y = y;
    }
  }
  speedUp() {
    gsap.to(this, {
      floatSpeed: 50,
      duration: 4,
      ease: "power2.in",
    });
  }
  speedDown() {
    gsap.to(this, {
      floatSpeed: 1,
      duration: 6,
      ease: "power3.inOut",
    });
  }
  async dash(duration = 5000, cb: any) {
    if (this.isDashing) {
      return;
    }

    this.isDashing = true;

    this.speedUp();

    await kokomi.sleep(duration);

    if (cb) {
      cb();
    }

    this.speedDown();
  }
  changeTexture(texture: THREE.Texture) {
    this.fgs.forEach((fg) => {
      fg.frags.forEach((frag) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        (frag.mesh.material as THREE.ShaderMaterial).uniforms.uTexture.value =
          texture;
      });
    });
  }
}

export { FragmentWorld };
