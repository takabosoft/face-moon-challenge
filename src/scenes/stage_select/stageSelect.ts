import { Button, ButtonStyle } from "../../components/button";
import { faceMoonChallengeLocalStorage } from "../../data/faceMoonChallengeLocalStorage";
import { gameState } from "../../data/gameState";
import { StageInfo, stageInfos } from "../../data/stageInfos";
import { GameScene } from "../game/gameScene";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";
import { TitleScene } from "../title/titleScene";

export class StageSelectScene extends Scene {
    constructor() {
        super("stage-select-scene");
        this.element.append(
            $(`<div class="title">`).text("ステージセレクト"),
            stageInfos.map((stageInfo, stageIdx) => this.buildStateButton(stageInfo, stageIdx).element),
            new Button("タイトルへ戻る", () => sceneController.changeScene(new TitleScene())).element.css("margin-top", 48),
        );
    }

    private buildStateButton(stageInfo: StageInfo, stageIdx: number): Button {

        const isCleared = stageIdx <= faceMoonChallengeLocalStorage.clearStageIndex;
        const isLocked = stageIdx >= faceMoonChallengeLocalStorage.clearStageIndex + 2;

        const styles: ButtonStyle[] = [];
        if (isCleared) {
            styles.push(ButtonStyle.ClearBadge);
        }
        if (isLocked) {
            styles.push(ButtonStyle.Locked);
        }

        const btn = new Button(isLocked ? "" : stageInfo.title, () => {
            gameState.stageIndex = stageIdx;
            sceneController.changeScene(new GameScene());
        }, styles);
        return btn;
    }
}