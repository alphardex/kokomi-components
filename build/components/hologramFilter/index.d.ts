import * as THREE from "three";
import * as POSTPROCESSING from "../../libs/postprocessing.esm.js";
declare class HologramFilter extends POSTPROCESSING.Effect {
    constructor({ blendFunction, progress, glowColor, glowColorStrength, }: {
        blendFunction?: any;
        progress?: number | undefined;
        glowColor?: THREE.Color | undefined;
        glowColorStrength?: number | undefined;
    });
}
export { HologramFilter };
