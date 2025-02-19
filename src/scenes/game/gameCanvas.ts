import { Component } from "../../components/component";
import { Rect } from "../../geometries/rect";
import { Vec2 } from "../../geometries/vec2";

const scale = 2;


/**
 * ゲーム表示用のキャンバスです。  
 * retina用に2倍で作りますが、仮想スクリーンでズーム調整が入ります。
 */
export class GameCanvas extends Component {
    private readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;

    /**
     * 
     * @param size CSSピクセル単位での画面サイズ（DPIを考慮しないサイズ）
     */
    constructor(size: Vec2, resizeCss = false) {
        super();
        this.element = $(`<canvas class="game-canvas">`);
        this.canvas = this.element[0] as HTMLCanvasElement;
        this.canvas.width = size.x * scale;
        this.canvas.height = size.y * scale;
        this.ctx = this.canvas.getContext("2d")!;
        this.ctx.imageSmoothingEnabled = false;
        if (resizeCss) {
            this.element.css({
                position: "relative",
                width: size.x,
                height: size.y,
            })
        }
    }

    /**
     * ステージが真ん中に表示されるようにコンテキストのトランスフォームを調整します。
     * @param stageSize ステージサイズ
     */
    setupTransform(stageSize: Vec2, padding: { bottom?: number } = {}): void {
        this.ctx.resetTransform();
        const renderTargetRect = new Rect(0, 0, this.canvas.width, this.canvas.height).deflate({ bottom: (padding.bottom ?? 0) * scale }).objectFitContain(stageSize);
        this.ctx.translate(renderTargetRect.x, renderTargetRect.y);
        this.ctx.scale(renderTargetRect.width / stageSize.x, renderTargetRect.height / stageSize.y);
    }

    clear(): void {
        const oldMat = this.ctx.getTransform();
        this.ctx.resetTransform();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setTransform(oldMat);
    }
}