import * as kokomi from "kokomi.js";
import * as THREE from "three";
export interface SphereWordCloudConfig {
    radius: number;
    segment: number;
    pointSize: number;
    pointOpacity: number;
    pointColor: string;
    lineOpacity: number;
    lineColor: string;
    baseClassName: string;
}
declare class SphereWordCloud extends kokomi.Component {
    points: THREE.Points;
    positions: THREE.Vector3[];
    htmls: kokomi.Html[];
    lines: THREE.Line[];
    lineOpacity: number;
    lineColor: string;
    baseClassName: string;
    constructor(base: kokomi.Base, config?: Partial<SphereWordCloudConfig>);
    addExisting(): void;
    getPositions(): void;
    removeSomePositions(): void;
    randomizePositions(): void;
    addHtmls(): void;
    addLines(): void;
    listenForHoverHtml(onMouseOver: any, onMouseLeave: any): void;
}
export { SphereWordCloud };
