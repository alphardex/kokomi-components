import * as kokomi from "kokomi.js";
export interface RGBShiftFilterConfig {
    intensity: number;
}
declare class RGBShiftFilter extends kokomi.Component {
    ce: kokomi.CustomEffect;
    constructor(base: kokomi.Base, config?: Partial<RGBShiftFilterConfig>);
    addExisting(): void;
}
export { RGBShiftFilter };
