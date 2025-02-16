import { Component } from "../../components/component";
import { Rgb } from "../../utils/rgb";
import { RgbRange } from "../../utils/rgbRange";

const rgbRange = new RgbRange(new Rgb(255, 0, 0), new Rgb(0, 255, 0));

/** エネルギー残量表示バー */
export class EnergyBar extends Component {
    static readonly height = 18 + 2;
    private readonly rectEl = $(`<div class="rect">`);
    private lastRatio = -1;

    constructor() {
        super();
        this.element = $(`<div class="energy-bar">`).append(this.rectEl);
    }

    set ratio(ratio: number) {
        if (this.lastRatio == ratio) { return; }
        this.lastRatio == ratio;
        this.rectEl.css({
            background: rgbRange.fade(ratio),
            width: `${ratio * 100}%`,
        });
    }
}