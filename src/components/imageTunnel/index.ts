import * as kokomi from "kokomi.js";
import * as THREE from "three";

export interface ImageTunnelConfig {
  urls: string[];
  speed: number;
  imageSize: number;
}

class ImageTunnel extends kokomi.Component {
  urls: string[];
  speed: number;
  imageSize: number;
  mat: THREE.MeshBasicMaterial;
  geo: THREE.CircleGeometry;
  meshs: THREE.Mesh[];
  isRunning: boolean;
  constructor(base: kokomi.Base, config: Partial<ImageTunnelConfig> = {}) {
    super(base);

    const { urls = [], speed = 1, imageSize = 5 } = config;
    this.urls = urls;
    this.speed = speed;
    this.imageSize = imageSize;

    const mat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
    this.mat = mat;

    const geo = new THREE.CircleGeometry(this.imageSize, 64);
    this.geo = geo;

    this.meshs = [];

    this.isRunning = false;
  }
  addMesh() {
    const matClone = this.mat.clone();
    const mesh = new THREE.Mesh(this.geo, matClone);
    this.container.add(mesh);
    return mesh;
  }
  addImage(url: string): Promise<THREE.Mesh> {
    return new Promise((resolve) => {
      new THREE.TextureLoader().load(
        url,
        (res) => {
          const mesh = this.addMesh();
          this.meshs.push(mesh);
          mesh.material.map = res;
          resolve(mesh);
        },
        () => {},
        () => {
          // @ts-ignore
          resolve(true);
        }
      );
    });
  }
  async addImages(urls: string[]) {
    await Promise.all(urls.map((url) => this.addImage(url)));
  }
  async addExisting() {
    await this.addImages(this.urls);
    this.emit("ready");
    this.randomizeMeshesPos();
    this.run();
  }
  update() {
    if (this.mat && this.meshs) {
      if (!this.isRunning) {
        return;
      }
      this.meshs.forEach((mesh) => {
        mesh.position.z = (mesh.position.z - 2 * this.speed) % 2000;
      });
    }
  }
  getRandomXY() {
    const theta = THREE.MathUtils.randFloat(0, 360);
    const r = THREE.MathUtils.randFloat(10, 50);
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    return { x, y };
  }
  getRandomPos() {
    const { x, y } = this.getRandomXY();
    const z = THREE.MathUtils.randFloat(-1000, 1000);
    return new THREE.Vector3(x, y, z);
  }
  randomizeMeshesPos() {
    if (this.meshs) {
      this.meshs.forEach((mesh) => {
        const randPos = this.getRandomPos();
        mesh.position.copy(randPos);
      });
    }
  }
  run() {
    this.isRunning = true;
  }
  stop() {
    this.isRunning = false;
  }
  async addImageAtRandXY(url: string) {
    const newMesh = await this.addImage(url);
    const { x, y } = this.getRandomXY();
    const newMeshPos = new THREE.Vector3(x, y, -900);
    newMesh.position.copy(newMeshPos);
  }
}

export { ImageTunnel };
