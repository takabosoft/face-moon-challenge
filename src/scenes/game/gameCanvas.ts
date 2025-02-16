import { Component } from "../../components/component";
import { Rect } from "../../geometries/rect";
import { Vec2 } from "../../geometries/vec2";
import { sceneController } from "../sceneController";
import { EnergyBar } from "./energyBar";

const scale = 2;


/**
 * ゲーム表示用のキャンバスです。  
 * retina用に2倍で作りますが、仮想スクリーンでズーム調整が入ります。
 */
export class GameCanvas extends Component {
    private readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;

    constructor() {
        super();
        const size = sceneController.screenSize;
        this.element = $(`<canvas class="game-canvas">`);
        this.canvas = this.element[0] as HTMLCanvasElement;
        this.canvas.width = size.x * scale;
        this.canvas.height = size.y * scale;
        this.ctx = this.canvas.getContext("2d")!;
        this.ctx.imageSmoothingEnabled = false;
    }

    /**
     * ステージが真ん中に表示されるようにコンテキストのトランスフォームを調整します。
     * @param stageSize ステージサイズ
     */
    setupTransform(stageSize: Vec2): void {
        this.ctx.resetTransform();
        const renderTargetRect = new Rect(0, 0, this.canvas.width, this.canvas.height).deflate({ bottom: EnergyBar.height * scale }).objectFitContain(stageSize);
        this.ctx.translate(renderTargetRect.x, renderTargetRect.y);
        this.ctx.scale(renderTargetRect.width / stageSize.x, renderTargetRect.height / stageSize.y);
    }

    clear(): void {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
}