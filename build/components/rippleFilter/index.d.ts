import * as kokomi from "kokomi.js";
import * as THREE from "three";
export interface RippleFilterConfig {
    texture: THREE.Texture;
    waveCount: number;
    intensity: number;
}
declare class RippleFilter extends kokomi.Component {
    ce: kokomi.CustomEffect;
    constructor(base: kokomi.Base, config?: Partial<RippleFilterConfig>);
    addExisting(): void;
}
export { RippleFilter };
