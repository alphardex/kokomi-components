import * as kokomi from "kokomi.js";
import * as THREE from "three";
export interface LiquidCrystalConfig {
    size: number;
    glow: number;
    mouse1Lerp: number;
    mouse2Lerp: number;
}
declare class LiquidCrystal extends kokomi.Component {
    sq: kokomi.ScreenQuad;
    mouse1Lerp: number;
    mouse2Lerp: number;
    offsetX1: number;
    offsetY1: number;
    offsetX2: number;
    offsetY2: number;
    constructor(base: kokomi.Base, texture: THREE.CubeTexture, config?: Partial<LiquidCrystalConfig>);
    addExisting(): void;
    update(time: number): void;
    followMouse(): void;
}
export { LiquidCrystal };
