import * as kokomi from "kokomi.js";
import * as THREE from "three";
export interface FragmentConfig {
    material: THREE.ShaderMaterial;
    points: THREE.Vector2[];
}
declare class Fragment extends kokomi.Component {
    points: THREE.Vector2[];
    mesh: THREE.Mesh;
    uj: kokomi.UniformInjector;
    constructor(base: kokomi.Base, config?: Partial<FragmentConfig>);
    addExisting(): void;
    update(): void;
}
export interface FragmentGroupConfig {
    material: THREE.ShaderMaterial;
    layerId: number;
    polygons: THREE.Vector2[][];
}
declare class FragmentGroup extends kokomi.Component {
    g: THREE.Group;
    frags: Fragment[];
    constructor(base: kokomi.Base, config?: Partial<FragmentGroupConfig>);
    addExisting(): void;
}
export interface GeneratePolygonsConfig {
    gridX: number;
    gridY: number;
    maxX: number;
    maxY: number;
}
export interface FragmentWorldConfig {
    material: THREE.ShaderMaterial;
    isShadertoyUniformInjected: boolean;
}
declare class FragmentWorld extends kokomi.Component {
    material: THREE.ShaderMaterial;
    uj: kokomi.UniformInjector;
    isShadertoyUniformInjected: boolean;
    fgs: FragmentGroup[];
    totalG: THREE.Group;
    floatDistance: number;
    floatSpeed: number;
    floatMaxDistance: number;
    isDashing: boolean;
    constructor(base: kokomi.Base, config?: Partial<FragmentWorldConfig>);
    addExisting(): void;
    update(): void;
    speedUp(): void;
    speedDown(): void;
    dash(duration: number | undefined, cb: any): Promise<void>;
    changeTexture(texture: THREE.Texture): void;
}
export { FragmentWorld };
