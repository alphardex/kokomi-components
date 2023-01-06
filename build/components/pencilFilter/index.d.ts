import * as kokomi from "kokomi.js";
import * as THREE from "three";
export interface PencilFilterConfig {
    texture: THREE.Texture;
    pencilColor: string;
    bgColor: string;
}
declare class PencilFilter extends kokomi.Component {
    ce: kokomi.CustomEffect;
    normalFBO: kokomi.FBO;
    constructor(base: kokomi.Base, config?: Partial<PencilFilterConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { PencilFilter };
