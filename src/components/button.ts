import { soundManager } from "../sounds/soundManager";
import { Component } from "./component";

export class Button extends Component {
    constructor(title: string, onClick: () => void) {
        super();
        this.element = $(`<button class="button">`).text(title).on("click", () => {
            soundManager.playButtonTap();
            onClick();
        });
    }
}