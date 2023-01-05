import * as kokomi from "kokomi.js";
import * as THREE from "three";
export interface StarTunnelConfig {
    count: number;
    pointColor1: string;
    pointColor2: string;
    pointSize: number;
    angularVelocity: number;
    velocity: number;
    vertexShader: string;
    fragmentShader: string;
}
declare class StarTunnel extends kokomi.Component {
    count: number;
    pointColor1: string;
    pointColor2: string;
    pointSize: number;
    angularVelocity: number;
    velocity: number;
    vertexShader: string;
    fragmentShader: string;
    uj: kokomi.UniformInjector;
    geometry: THREE.BufferGeometry | null;
    material: THREE.ShaderMaterial | null;
    points: THREE.Points | null;
    constructor(base: kokomi.Base, config?: Partial<StarTunnelConfig>);
    create(): void;
    addExisting(): void;
    update(time: number): void;
    changePos(): void;
    dispose(): void;
}
export { StarTunnel };
