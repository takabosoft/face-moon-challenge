import { Component } from "../../components/component";

/** エネルギー残量表示バー */
export class EnergyBar extends Component {
    private readonly rectEl = $(`<div class="rect">`);

    constructor() {
        super();
        this.element = $(`<div class="energy-bar">`).append(this.rectEl);
    }
}