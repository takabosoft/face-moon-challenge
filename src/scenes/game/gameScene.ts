import { FixedSimulationAnimator } from "../../animation/fixedSimulationAnimator";
import { MutableVec2 } from "../../geometries/mutableVec2";
import { Vec2 } from "../../geometries/vec2";
import { spriteInfos, spriteSheet } from "../../spriteSheet";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";
import { EnergyBar } from "./energyBar";
import { GameCanvas } from "./gameCanvas";
import { Spaceship } from "./spaceship";
import { Terrain } from "./terrain";

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
    private readonly terrain: Terrain;
    private readonly spaceship: Spaceship;

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

        // ステージデータ準備
        this.terrain = new Terrain(spriteInfos.stage1Terrain);
        this.spaceship = new Spaceship(new MutableVec2((spriteInfos.stage1Terrain.width - spriteInfos.spaceship.width) / 2, 16));
    }

    override async onStartScene() {
        //await sceneController.faceStateTracker.startTrack();
        this.gameCanvas.setupTransform(this.terrain.spriteRect.size);
        this.fixedSimAnimator.start(() => this.onSimulation(), deltaSec => this.onRender(deltaSec))
    }

    /** シミュレーションとしてゲームの時間を進めます（固定フレーム）。 */
    private onSimulation(): void {
        this.spaceship.onSimulation(this.terrain);
    }

    /** レンダリング（可変フレーム） */
    private onRender(deltaSec: number): void {
        this.gameCanvas.clear();

        this.terrain.draw(this.gameCanvas.ctx);
        this.spaceship.draw(this.gameCanvas.ctx);

        this.debugText.text(`FPS: ${this.fixedSimAnimator.fps}, Mouth: ${sceneController.faceStateTracker.lastFaceState?.isMouthOpen}, Dir: ${sceneController.faceStateTracker.lastFaceState?.yaw.toFixed(2)}`);
    }
}

