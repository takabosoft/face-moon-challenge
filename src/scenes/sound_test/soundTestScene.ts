import { soundManager } from "../../sounds/soundManager";
import { Scene } from "../scene";

export class SoundTestScene extends Scene {
    constructor() {
        super("sound-test-scene");
        this.element.append(
            $(`<button class="button">`).text("TEST").on("click", () => soundManager.test()),
        );
    }
}