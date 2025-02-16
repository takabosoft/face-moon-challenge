import { DynamicFrameTweenAnimator } from "../animation/dynamicFrameTweenAnimator";
import { easeInOutQuintic, lerpNumber } from "../animation/easing";
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
 *   - Virtual Screen 1 (Zoom up/down)
 *     - Scene...
 *   - darkness
 *   - Virtual Screen 2 (Zoom up/down)
 *     - overlap menu
 */
class SceneController extends Component {
    readonly faceStateTracker = new FaceStateTracker();
    private readonly screen1 = new VirtualScreen(new Vec2(375, 630));
    private screen2?: VirtualScreen;

    constructor() {
        super();
        this.element = $(`<div class="scene-ctrl">`).append(
            this.faceStateTracker.element,
            this.screen1.element,
        );

        const resizeObserver = new ResizeObserver(() => this.layout());
        resizeObserver.observe(this.element[0]);
    }

    get screenSize() { return this.screen1.size; }

    private layout() {
        const area = Rect.fromOuterBounds(this.element);
        const vsRect = area.objectFitContain(this.screen1.size);
        this.screen1.layout(vsRect);
        this.screen2?.layout(vsRect);
    }

    /** シーンを変更します。 */
    async changeScene(newScene: Scene): Promise<void> {
        //console.log("changeScene:", newScene);

        this.closeOverlayMenu();
        this.screen1.element.empty().append(newScene.element);
        newScene.onStartScene();
    }

    /** エラーページへ遷移します（復帰不可能） */
    error(msg: string) {
        this.changeScene(new ErrorScene(msg));
    }

    showOverlayMenu(element: JQuery): void {
        if (this.screen2 != null) { return; }
        this.screen2 = new VirtualScreen(this.screen1.size);
        this.element.append(
            $(`<div class="darkness">`),
            this.screen2.element.append(element)
        );
        this.layout();
    }

    closeOverlayMenu(): void {
        this.element.find(".darkness").remove();
        this.screen2?.element.remove();
        this.screen2 = undefined;
    }
}

export const sceneController = new SceneController();
