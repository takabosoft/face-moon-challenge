import { Component } from "../components/component";
import { VirtualScreen } from "../components/virtualScreen";
import { FaceStateTracker } from "../faces/faceStateTracker";
import { Rect } from "../geometries/rect";
import { Vec2 } from "../geometries/vec2";
import { ErrorScene } from "./error/errorScene";
import { Scene } from "./scene";

/**
 * ## View階層
 * - SceneController
 *   - Video (FaceStateTracker)
 *   - Virtual Screen (Zoom up/down)
 *     - Scene...
 */
class SceneController extends Component {
    readonly faceStateTracker = new FaceStateTracker();
    private readonly screen = new VirtualScreen(new Vec2(375, 630));

    constructor() {
        super();
        this.element = $(`<div class="scene-ctrl">`).append(
            this.faceStateTracker.element,
            this.screen.element,
        );

        const resizeObserver = new ResizeObserver(() => this.layout());
        resizeObserver.observe(this.element[0]);
    }

    get screenSize() { return this.screen.size; }

    private layout() {
        const area = Rect.fromOuterBounds(this.element);
        const vsRect = area.objectFitContain(this.screen.size);
        this.screen.layout(vsRect);
    }

    changeScene(newScene: Scene): void {
        // 何かトランジション付けたいよなあ
        this.screen.element.empty().append(newScene.element);
        newScene.onStartScene();
    }

    error(msg: string) {
        this.changeScene(new ErrorScene(msg));
    }
}

export const sceneController = new SceneController();
