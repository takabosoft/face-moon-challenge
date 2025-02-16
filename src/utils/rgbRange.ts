import { Rgb } from "./rgb";

function toHex(v: number): string {
    return Math.floor(v).toString(16).padStart(2, "0");
}

export class RgbRange {
    constructor(
        readonly col1: Rgb,
        readonly col2: Rgb,
    ) {

    }

    fade(a: number): string {
        const bld = (v1: number, v2: number) => toHex(v1 * (1 - a) + v2 * a);
        return `#${bld(this.col1.r, this.col2.r)}${bld(this.col1.g, this.col2.g)}${bld(this.col1.b, this.col2.b)}`;
    }

    rnd(): string {
        return this.fade(Math.random())
    }
}