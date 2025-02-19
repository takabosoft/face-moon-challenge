import { Button } from "../../../components/button";
import { Component } from "../../../components/component";
import { gameState } from "../../../data/gameState";
import { sceneController } from "../../sceneController";
import { StageSelectScene } from "../../stage_select/stageSelect";
import { GameScene } from "../gameScene";

const msgs: string[] = [
    "うまい！",
    "こちら管制塔、着陸を確認！",
    "静かの海に、無事降り立った…！",
    "人類の新たな一歩だ！",
];

export class GameClearMenu extends Component {
    constructor() {
        super();
        this.element = $(`<div class="game-clear-menu">`).append(
            $(`<div class="stage">`).text(`ステージ${gameState.stageInfo.title}`),
            $(`<div class="title">`).text("着陸成功"),
            $(`<div class="message">`).text(msgs[Math.floor(msgs.length * Math.random())]),
            new Button("もう一回遊ぶ", () => sceneController.changeScene(new GameScene())).element,
            new Button("ステージセレクト", () => sceneController.changeScene(new StageSelectScene())).element,
        );
    }
}