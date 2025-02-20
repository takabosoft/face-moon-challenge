import { FixedSimulationAnimator } from "../../animation/fixedSimulationAnimator";
import { Button } from "../../components/button";
import { spriteInfos, spriteSheet } from "../../data/spriteSheet";
import { MutableVec2 } from "../../geometries/mutableVec2";
import { Vec2 } from "../../geometries/vec2";
import { soundManager } from "../../sounds/soundManager";
import { GameCanvas } from "../game/gameCanvas";
import { ParticleManager } from "../game/particleManager";
import { Spaceship } from "../game/spaceship";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";
import { StageSelectScene } from "../stage_select/stageSelect";

const msgs = [
    "口を開けると上へ、左右を向くと左右に力が加わります。",
    "この画面で操作のテストができます。",
    "着陸船を操作して、着陸ポイントへ<span>ゆっくりと</span>着陸させてください。",
    "ステージは5つあります。",
];

export class RulesScene extends Scene {
    private readonly gameCanvas = new GameCanvas(new Vec2(sceneController.screenSize.x, 200), true);
    private readonly fixedSimAnimator = new FixedSimulationAnimator(60);
    private readonly spaceship = new Spaceship(new MutableVec2(32, 27), 50);
    private readonly particleMan = new ParticleManager();
    private count = 0;

    constructor() {
        super("rules-scene");
        this.element.append(
            $(`<div class="title">`).text("遊び方"),
            this.gameCanvas.element,
            $(`<ul>`).append(msgs.map(m => $(`<li>`).html(m))),
            new Button("わかった", () => sceneController.changeScene(new StageSelectScene())).element,
        );
    }

    override async onStartScene() {
        this.gameCanvas.setupTransform(spriteInfos.instruction1.size);
        this.fixedSimAnimator.start(() => this.onSimulation(), deltaSec => this.onRender(deltaSec));
    }

    override onEndScene(): void {
        this.fixedSimAnimator.stop();
        soundManager.stopSpaceshipSounds();
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