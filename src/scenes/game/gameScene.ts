import { FixedSimulationAnimator } from "../../animation/fixedSimulationAnimator";
import { Vec2 } from "../../geometries/vec2";
import { spriteInfos, spriteSheet } from "../../spriteSheet";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";
import { EnergyBar } from "./energyBar";
import { GameCanvas } from "./gameCanvas";

/**
 * ## View階層
 * - Scene
 *   - GameCanvas
 *   - Debug Text
 *   - energy container
 *     - label
 *     - bar
 */
export class GameScene extends Scene {
    private readonly debugText = $(`<div class="debug-text">`);
    private readonly gameCanvas = new GameCanvas();
    private readonly fixedSimAnimator = new FixedSimulationAnimator(60);

    constructor() {
        super("game-scene");

        this.element.append(
            this.gameCanvas.element,
            this.debugText,
            $(`<div class="energy-container">`).append(
                $(`<div class="energy-label">`).text("ENERGY:"),
                new EnergyBar().element,
            ),
        );
    }

    override async onStartScene() {
        //await sceneController.faceStateTracker.startTrack();
        this.gameCanvas.setupTransform(spriteInfos.stage1.size);
        this.fixedSimAnimator.start(() => this.onSimulation(), deltaSec => this.onRender(deltaSec))
    }

    /** シミュレーションとしてゲームの時間を進めます（固定フレーム）。 */
    private onSimulation(): void {

    }

    /** レンダリング（可変フレーム） */
    private onRender(deltaSec: number): void {
        this.gameCanvas.clear();

        spriteSheet.drawSprite(this.gameCanvas.ctx, 0, 0, spriteInfos.stage1);
        spriteSheet.drawSprite(this.gameCanvas.ctx, (spriteInfos.stage1.width - spriteInfos.ship.width) / 2, 16, spriteInfos.ship);

        this.debugText.text(`FPS: ${this.fixedSimAnimator.fps}, Mouth: ${sceneController.faceStateTracker.lastFaceState?.isMouthOpen}, Dir: ${sceneController.faceStateTracker.lastFaceState?.yaw.toFixed(2)}`);
    }
}

