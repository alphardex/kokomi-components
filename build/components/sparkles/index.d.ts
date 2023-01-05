import * as kokomi from "kokomi.js";
import * as THREE from "three";
export interface SparklesConfig {
    count: number;
    size: number;
    xRange: number[];
    yRange: number[];
    zRange: number[];
    speed: number;
    opacity: number;
    color: THREE.Color;
    vertexShader: string;
    fragmentShader: string;
}
declare class Sparkles extends kokomi.Component {
    uj: kokomi.UniformInjector;
    sparkles: THREE.Points;
    constructor(base: kokomi.Base, config?: Partial<SparklesConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { Sparkles };
