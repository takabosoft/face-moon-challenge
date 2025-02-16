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
    }

    /**
     * ステージが真ん中に表示されるようにコンテキストのトランスフォームを調整します。
     * @param stageSize 
     */
    setupTransform(stageSize: Vec2): void {
        this.ctx.resetTransform();
        const targetRect = new Rect(0, 0, this.canvas.width, this.canvas.height).deflate({ bottom: EnergyBar.height }).objectFitContain(stageSize);
        this.ctx.translate(targetRect.x, targetRect.y);
        this.ctx.scale(targetRect.width / stageSize.x, targetRect.height / stageSize.y);
    }

    clear(): void {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
}