import { faceApi } from "../../faces/faceApiWrapper";
import { GameScene } from "../game/gameScene";
import { Scene } from "../scene";

export class LoadingScene extends Scene {
    constructor() {
        super("loading-scene");
        this.element.text("ロード中...");
    }

    override async onStartScene() {
        try {
            await Promise.all([
                faceApi.readWeights(),
            ]);

            this.sceneController.changeScene(new GameScene());
            
        } catch (e) {
            this.sceneController.error(`エラーが発生しました(${e})。`);
        }
    }
}