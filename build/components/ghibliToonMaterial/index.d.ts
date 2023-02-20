import * as THREE from "three";
export interface GhibliToonMaterialConfig {
    colors: THREE.Color[];
    brightnessThresholds: number[];
    lightPosition: THREE.Vector3;
}
declare class GhibliToonMaterial extends THREE.ShaderMaterial {
    constructor(config?: Partial<GhibliToonMaterialConfig>);
}
export { GhibliToonMaterial };
