import { FixedSimulationAnimator } from "../../animation/fixedSimulationAnimator";
import { Button } from "../../components/button";
import { spriteInfos, spriteSheet } from "../../data/spriteSheet";
import { MutableVec2 } from "../../geometries/mutableVec2";
import { Vec2 } from "../../geometries/vec2";
import { GameCanvas } from "../game/gameCanvas";
import { ParticleManager } from "../game/particleManager";
import { Spaceship } from "../game/spaceship";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";
import { StageSelectScene } from "../stage_select/stageSelect";
import { VideoDisplayStyleSelector } from "./videoDisplayStyleSelector";

/** タイトル */
export class TitleScene extends Scene {
    private readonly gameCanvas = new GameCanvas(new Vec2(sceneController.screenSize.x, 200), true);
    private readonly fixedSimAnimator = new FixedSimulationAnimator(60);
    private readonly spaceship = new Spaceship(new MutableVec2(32, 27), 50);
    private readonly particleMan = new ParticleManager();
    private count = 0;

    constructor() {
        super("title-scene");

        this.element.append(
            $(`<div class="title"><span class="face">顔</span><span class="de">で</span><span class="moon">月面着陸</span><br><span class="challenge">チャレンジ</span></div>`),
            this.gameCanvas.element,
            $(`<div class="video-style-selector-container">`).append(
                $(`<div>`).text("ビデオ表示："),
                new VideoDisplayStyleSelector().element,
            ),
            new Button("スタート", () => sceneController.changeScene(new StageSelectScene())).element,
            $(`<div class="copyright">`).text("Copyright (C) 2025 Takabo Soft"),
        );
    }

    override async onStartScene() {
        /*if (!await sceneController.faceStateTracker.startTrack()) {
            return;
        }*/
        this.gameCanvas.setupTransform(spriteInfos.instruction1.size);
        this.fixedSimAnimator.start(() => this.onSimulation(), deltaSec => this.onRender(deltaSec));
    }

    override onEndScene(): void {
        this.fixedSimAnimator.stop();
    }

    private onSimulation(): void {
        this.particleMan.onSimulation();
        this.spaceship.onSimulation(undefined, this.particleMan, undefined);
        this.count++;
    }

    private onRender(deltaSec: number): void {
        this.gameCanvas.clear();
        this.particleMan.draw(this.gameCanvas.ctx);
        spriteSheet.drawSprite(this.gameCanvas.ctx, 0, 0, Math.floor(this.count / 40) % 2 ? spriteInfos.instruction1 : spriteInfos.instruction2);
        
        this.spaceship.draw(this.gameCanvas.ctx);
    }
}