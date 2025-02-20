import { Button } from "../../components/button";
import { RulesScene } from "../rules/rulesScene";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";
import { VideoDisplayStyleSelector } from "./videoDisplayStyleSelector";

/** タイトル */
export class TitleScene extends Scene {
    constructor() {
        super("title-scene");

        this.element.append(
            $(`<div class="title"><span class="face">顔</span><span class="de">で</span><span class="moon">月面着陸</span><br><span class="challenge">チャレンジ</span></div>`),
            $(`<div class="video-style-selector-container">`).append(
                $(`<div>`).text("ビデオ表示："),
                new VideoDisplayStyleSelector().element,
            ),
            new Button("スタート", () => sceneController.changeScene(new RulesScene())).element,
            $(`<div class="copyright">Copyright (C) 2025 <a href="https://takabosoft.com/" target="_blank">Takabo Soft</a></div>`),
            $(`<div class="sub-menu">`).append(
                $(`<a href="license.txt" target="_blank">知的財産の表記</a>`),
            )
        );
    }

    override async onStartScene() {
        if (!await sceneController.faceStateTracker.startTrack()) {
            return;
        }
    }
}