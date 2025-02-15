import { Scene } from "../scene";

export class ErrorScene extends Scene {
    constructor(msg: string) {
        super("error-scene");
        this.element.text(msg);
    }
}