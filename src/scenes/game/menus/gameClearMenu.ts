import { Component } from "../../../components/component";
import { gameState } from "../../../data/gameState";
import { sceneController } from "../../sceneController";
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
            $(`<button class="button">`).text("もう一回遊ぶ").on("click", () => sceneController.changeScene(new GameScene())),
            $(`<button class="button">`).text("ステージセレクト").on("click", () => {}), // TODO:
        );
    }
}