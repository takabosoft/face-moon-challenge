import { Component } from "../../components/component";

/** エネルギー残量表示バー */
export class EnergyBar extends Component {
    static readonly height = 18 + 2;
    private readonly rectEl = $(`<div class="rect">`);

    constructor() {
        super();
        this.element = $(`<div class="energy-bar">`).append(this.rectEl);
    }
}