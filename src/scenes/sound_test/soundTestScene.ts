import { soundManager } from "../../sounds/soundManager";
import { Scene } from "../scene";

/**
 * https://127.0.0.1:8080/?soundTest=1
 */
export class SoundTestScene extends Scene {
    constructor() {
        super("sound-test-scene");
        this.element.append(
            $(`<button class="button">`).text("左ガス Play").on("click", () => soundManager.leftGusSound.play()),
            $(`<button class="button">`).text("左ガス Stop").on("click", () => soundManager.leftGusSound.stop()),
            
            $(`<button class="button">`).text("右ガス Play").on("click", () => soundManager.rightGusSound.play()),
            $(`<button class="button">`).text("右ガス Stop").on("click", () => soundManager.rightGusSound.stop()),

            $(`<button class="button">`).text("Engine Play").on("click", () => soundManager.mainEngineSound.play()),
            $(`<button class="button">`).text("Engine Stop").on("click", () => soundManager.mainEngineSound.stop()),
        );
    }
}