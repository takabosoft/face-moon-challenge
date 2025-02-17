import { faceApi } from "../../faces/faceApiWrapper";
import { spriteSheet } from "../../data/spriteSheet";
import { GameScene } from "../game/gameScene";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";
import { SoundTestScene } from "../sound_test/soundTestScene";

export class LoadingScene extends Scene {
    constructor() {
        super("loading-scene");
        this.element.text("ロード中...");
    }

    override async onStartScene() {
        try {
            await Promise.all([
                faceApi.readWeights(),
                spriteSheet.load(),
            ]);

            //sceneController.changeScene(new GameScene());
            sceneController.changeScene(new SoundTestScene());
            
            
        } catch (e) {
            sceneController.error(`エラーが発生しました(${e})。`);
        }
    }
}