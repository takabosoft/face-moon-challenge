import { soundManager } from "../sounds/soundManager";
import { Component } from "./component";

export const enum ButtonStyle {
    ClearBadge = "clear-badge",
    Locked = "locked",
}

export class Button extends Component {
    constructor(title: string, onClick: () => void, addClass: ButtonStyle[] = []) {
        super();
        this.element = $(`<button class="button">`).text(title).on("click", () => {
            soundManager.playButtonTap();
            onClick();
        }).addClass(addClass);
    }
}