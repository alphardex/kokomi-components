import * as kokomi from "kokomi.js";
export interface SwellFilterConfig {
    intensity: number;
}
declare class SwellFilter extends kokomi.Component {
    ce: kokomi.CustomEffect;
    progress: number;
    constructor(base: kokomi.Base, config?: Partial<SwellFilterConfig>);
    addExisting(): void;
    update(): void;
    linkScroll(delta: number): void;
}
export { SwellFilter };
