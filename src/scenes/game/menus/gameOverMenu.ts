import { Button } from "../../../components/button";
import { Component } from "../../../components/component";
import { gameState } from "../../../data/gameState";
import { sceneController } from "../../sceneController";
import { StageSelectScene } from "../../stage_select/stageSelect";
import { GameScene } from "../gameScene";

const msgs: string[] = [
    "爆発しちゃったけど無人だから安心して！",
    "もう一回チャレンジしてみよう！",
    "アゴは大丈夫そう？無理はしないでね！",
    "次はきっとうまくいくよ！",
];

export class GameOverMenu extends Component {
    constructor() {
        super();
        this.element = $(`<div class="game-over-menu">`).append(
            $(`<div class="stage">`).text(`ステージ${gameState.stageInfo.title}`),
            $(`<div class="title">`).text("着陸失敗"),
            $(`<div class="message">`).text(msgs[Math.floor(msgs.length * Math.random())]),
            new Button("再チャレンジ", () => sceneController.changeScene(new GameScene())).element,
            new Button("ステージセレクト", () => sceneController.changeScene(new StageSelectScene())).element,
        );
    }
}