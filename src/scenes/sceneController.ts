import { Component } from "../components/component";
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
export class SceneController extends Component {
    readonly faceStateTracker = new FaceStateTracker(this);
    private readonly screen = new virtualScreen(new Vec2(375, 630));

    constructor() {
        super();
        this.element = $(`<div class="scene-ctrl">`).append(
            this.faceStateTracker.element,
            this.screen.element,
        );

        const resizeObserver = new ResizeObserver(() => this.layout());
        resizeObserver.observe(this.element[0]);
    }

    private layout() {
        const area = Rect.fromOuterBounds(this.element);
        const vsRect = area.objectFitContain(this.screen.size);
        this.screen.layout(vsRect);
    }

    changeScene(newScene: Scene): void {
        // 何かトランジション付けたいよなあ
        newScene.sceneController = this;
        this.screen.element.empty().append(newScene.element);
        newScene.onStartScene();
    }

    error(msg: string) {
        this.changeScene(new ErrorScene(msg));
    }
}

class virtualScreen extends Component {
    private _rect: Rect;

    constructor(readonly size: Vec2) {
        super();
        this.element = $(`<div class="screen">`).css({
            width: size.x,
            height: size.y,
        });
        this._rect = new Rect(0, 0, size.x, size.y);
    }

    get rect() { return this._rect; }
    get scale() { return this._rect.width / this.size.x; }

    layout(rect: Rect): void {
        this._rect = rect;
        this.element.css("transform", `translate(${rect.x}px, ${rect.y}px) scale(${this.scale})`);
    }
}