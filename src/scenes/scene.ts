import { Component } from "../components/component";

export class Scene extends Component {
    constructor(addClass: string) {
        super();
        this.element = $(`<div class="scene">`).addClass(addClass);
    }

    /** 画面が切り替わり終わったときに呼ばれます。 */
    onStartScene(): void {

    }
}
