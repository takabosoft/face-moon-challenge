import { Component } from "../components/component";
import { SceneController } from "./sceneController";

export class Scene extends Component {
    sceneController!: SceneController;

    constructor(addClass: string) {
        super();
        this.element = $(`<div class="scene">`).addClass(addClass);
    }

    /** 画面が切り替わり終わったときに呼ばれます。 */
    onStartScene(): void {

    }
}
