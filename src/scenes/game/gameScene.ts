import { FixedSimulationAnimator } from "../../animation/fixedSimulationAnimator";
import { MutableVec2 } from "../../geometries/mutableVec2";
import { Rect } from "../../geometries/rect";
import { spriteInfos } from "../../spriteSheet";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";
import { EnergyBar } from "./energyBar";
import { GameCanvas } from "./gameCanvas";
import { LandingZone } from "./landingZone";
import { GameOverMenu } from "./menus/gameOverMenu";
import { ParticleManager } from "./particleManager";
import { Spaceship } from "./spaceship";
import { Terrain } from "./terrain";

const enum GameSceneState {
    Ready_3 = 0,
    Ready_2,
    Ready_1,
    Ready_GO,
    Play,
    GameOver,
    Clear,
}

/**
 * ## View階層
 * - Scene
 *   - GameCanvas
 *   - Debug Text
 *   - Energy Container
 *     - label
 *     - bar
 * 　- Ready Text
 */
export class GameScene extends Scene {
    //private readonly debugText = $(`<div class="debug-text">`);
    private readonly readyText = $(`<div class="ready-text">`).text("3");
    private readonly gameCanvas = new GameCanvas();
    private readonly energyBar = new EnergyBar();
    private readonly fixedSimAnimator = new FixedSimulationAnimator(60);
    private readonly terrain: Terrain;
    private readonly landingZone: LandingZone;
    private readonly spaceship: Spaceship;
    private readonly particleMan = new ParticleManager();
    private state = GameSceneState.Ready_3;
    private readyCount = 0;
    
    constructor() {
        super("game-scene");

        this.element.append(
            this.gameCanvas.element,
            //this.debugText,
            $(`<div class="energy-container">`).append(
                $(`<div class="energy-label">`).text("ENERGY:"),
                this.energyBar.element,
            ),
            this.readyText,
        );

        // ステージデータ準備
        this.terrain = new Terrain(spriteInfos.stage1Terrain);
        this.landingZone = new LandingZone(new Rect(29, 139, 38, 1));
        this.spaceship = new Spaceship(new MutableVec2((spriteInfos.stage1Terrain.width - spriteInfos.spaceship.width) / 2, 16), 50);
    }

    override async onStartScene() {
        await sceneController.faceStateTracker.startTrack();
        this.gameCanvas.setupTransform(this.terrain.spriteRect.size);
        this.fixedSimAnimator.start(() => this.onSimulation(), deltaSec => this.onRender(deltaSec));

        //sceneController.showOverlayMenu(new GameOverMenu().element);
    }

    /** シミュレーションとしてゲームの時間を進めます（固定フレーム）。 */
    private onSimulation(): void {
        this.particleMan.onSimulation();
        this.landingZone.onSimulation();
        this.spaceship.onSimulation(this.terrain, this.particleMan, this.landingZone);

        // カウントダウン的な
        if (this.state < GameSceneState.Play) {
            this.readyCount++;
            if (this.readyCount > 25) {
                this.readyCount = 0;
                this.state++;
                switch (this.state) {
                    case GameSceneState.Ready_2:
                        this.readyText.text("2");
                        break;
                    case GameSceneState.Ready_1:
                        this.readyText.text("1");
                        break;
                    case GameSceneState.Ready_GO:
                        this.readyText.text("GO!");
                        break;
                    case GameSceneState.Play:
                        this.readyText.remove();
                        this.spaceship.play();
                        break;
                }
            }
        }
    }

    /** レンダリング（可変フレーム） */
    private onRender(deltaSec: number): void {
        this.gameCanvas.clear();
        this.particleMan.draw(this.gameCanvas.ctx);
        this.landingZone.draw(this.gameCanvas.ctx);
        this.terrain.draw(this.gameCanvas.ctx);
        this.spaceship.draw(this.gameCanvas.ctx);
        this.energyBar.ratio = this.spaceship.energyRatio;
        //this.debugText.text(`FPS: ${this.fixedSimAnimator.fps}, Mouth: ${sceneController.faceStateTracker.lastFaceState?.isMouthOpen}, Dir: ${sceneController.faceStateTracker.lastFaceState?.yaw.toFixed(2)}`);
    }
}

