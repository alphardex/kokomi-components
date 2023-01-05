import * as kokomi from "kokomi.js";
import * as THREE from "three";
declare class GridIcosahedron extends kokomi.Component {
    uj: kokomi.UniformInjector;
    ico: THREE.Group;
    materialShape: THREE.ShaderMaterial;
    materialEdge: THREE.ShaderMaterial;
    shapeMesh: THREE.Mesh;
    edgeMesh: THREE.Mesh;
    constructor(base: kokomi.Base, texture: THREE.Texture);
    addExisting(): void;
    update(time: number): void;
    autoRotate(): void;
}
export { GridIcosahedron };
