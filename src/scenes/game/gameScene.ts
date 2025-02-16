import { FixedSimulationAnimator } from "../../animation/fixedSimulationAnimator";
import { MutableVec2 } from "../../geometries/mutableVec2";
import { Rect } from "../../geometries/rect";
import { spriteInfos, spriteSheet } from "../../spriteSheet";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";
import { EnergyBar } from "./energyBar";
import { GameCanvas } from "./gameCanvas";
import { LandingZone } from "./landingZone";
import { ParticleManager } from "./particleManager";
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
    private readonly energyBar = new EnergyBar();
    private readonly fixedSimAnimator = new FixedSimulationAnimator(60);
    private readonly terrain: Terrain;
    private readonly landingZone: LandingZone;
    private readonly spaceship: Spaceship;
    private readonly particleMan = new ParticleManager();
    
    constructor() {
        super("game-scene");

        this.element.append(
            this.gameCanvas.element,
            this.debugText,
            $(`<div class="energy-container">`).append(
                $(`<div class="energy-label">`).text("ENERGY:"),
                this.energyBar.element,
            ),
        );

        // ステージデータ準備
        this.terrain = new Terrain(spriteInfos.stage1Terrain);
        this.landingZone = new LandingZone(new Rect(29, 139, 38, 1));
        this.spaceship = new Spaceship(new MutableVec2((spriteInfos.stage1Terrain.width - spriteInfos.spaceship.width) / 2, 16), 50);
    }

    override async onStartScene() {
        await sceneController.faceStateTracker.startTrack();
        this.gameCanvas.setupTransform(this.terrain.spriteRect.size);
        this.fixedSimAnimator.start(() => this.onSimulation(), deltaSec => this.onRender(deltaSec))
    }

    /** シミュレーションとしてゲームの時間を進めます（固定フレーム）。 */
    private onSimulation(): void {
        this.particleMan.onSimulation();
        this.landingZone.onSimulation();
        this.spaceship.onSimulation(this.terrain, this.particleMan);
    }

    /** レンダリング（可変フレーム） */
    private onRender(deltaSec: number): void {
        this.gameCanvas.clear();

        this.particleMan.draw(this.gameCanvas.ctx);
        this.landingZone.draw(this.gameCanvas.ctx);
        this.terrain.draw(this.gameCanvas.ctx);
        this.spaceship.draw(this.gameCanvas.ctx);
        this.energyBar.ratio = this.spaceship.energyRatio;
        this.debugText.text(`FPS: ${this.fixedSimAnimator.fps}, Mouth: ${sceneController.faceStateTracker.lastFaceState?.isMouthOpen}, Dir: ${sceneController.faceStateTracker.lastFaceState?.yaw.toFixed(2)}`);
    }
}

