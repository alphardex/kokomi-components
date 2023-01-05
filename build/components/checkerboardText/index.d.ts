import * as kokomi from "kokomi.js";
export interface CheckerboardTextConfig {
    scroller: any;
    textColor: string;
    shadowColor: string;
    textSpacing: number;
    grid: number[];
    font: string;
    elList: HTMLElement[];
}
export interface CheckerboardTextAnimeConfig {
    duration: number;
    delay: number;
    stagger: number;
}
declare class CheckerboardText extends kokomi.Component {
    mg: kokomi.MojiGroup;
    textColor: string;
    textSpacing: number;
    font: string;
    constructor(base: kokomi.Base, config?: Partial<CheckerboardTextConfig>);
    addExisting(): void;
    fadeIn(textClass: string, config?: Partial<CheckerboardTextAnimeConfig>): void;
    fadeOut(textClass: string, config?: Partial<CheckerboardTextAnimeConfig>): void;
}
export { CheckerboardText };
