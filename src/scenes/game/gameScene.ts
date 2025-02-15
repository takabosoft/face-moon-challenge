import { AnimationFrameRequester } from "../../animation/animationFrameRequester";
import { Scene } from "../scene";
import { EnergyBar } from "./energyBar";

export class GameScene extends Scene {
    private readonly stageContainer = $(`<div class="stage-container">`);

    constructor() {
        super("game-scene");
        this.element.append(
            this.stageContainer,

            $(`<div class="energy-container">`).append(
                $(`<div class="energy-label">`).text("ENERGY:"),
                new EnergyBar().element,
            ),
        );
    }

    override async onStartScene() {
        await this.sceneController.faceStateTracker.startTrack();

        const req = new AnimationFrameRequester();

        const frame = () => {
            this.stageContainer.text(`mouth: ${this.sceneController.faceStateTracker.lastFaceState?.isMouthOpen}`);
            

            req.request(() => frame());
        };

        req.request(() => frame());
    }
}

