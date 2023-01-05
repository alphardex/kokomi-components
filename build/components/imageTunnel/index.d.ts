import * as kokomi from "kokomi.js";
import * as THREE from "three";
export interface ImageTunnelConfig {
    urls: string[];
    speed: number;
    imageSize: number;
}
declare class ImageTunnel extends kokomi.Component {
    urls: string[];
    speed: number;
    imageSize: number;
    mat: THREE.MeshBasicMaterial;
    geo: THREE.CircleGeometry;
    meshs: THREE.Mesh[];
    isRunning: boolean;
    constructor(base: kokomi.Base, config?: Partial<ImageTunnelConfig>);
    addMesh(): THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>;
    addImage(url: string): Promise<THREE.Mesh>;
    addImages(urls: string[]): Promise<void>;
    addExisting(): Promise<void>;
    update(): void;
    getRandomXY(): {
        x: number;
        y: number;
    };
    getRandomPos(): THREE.Vector3;
    randomizeMeshesPos(): void;
    run(): void;
    stop(): void;
    addImageAtRandXY(url: string): Promise<void>;
}
export { ImageTunnel };
