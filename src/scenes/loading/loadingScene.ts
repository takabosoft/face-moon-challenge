import { faceApi } from "../../faces/faceApiWrapper";
import { spriteSheet } from "../../data/spriteSheet";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";
import { TitleScene } from "../title/titleScene";

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
            sceneController.changeScene(new TitleScene());
        } catch (e) {
            sceneController.error(`エラーが発生しました(${e})。`);
        }
    }
}