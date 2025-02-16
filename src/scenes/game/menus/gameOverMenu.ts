import { Component } from "../../../components/component";
import { sceneController } from "../../sceneController";
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
            $(`<div class="title">`).text("着陸失敗"),
            $(`<div class="message">`).text(msgs[Math.floor(msgs.length * Math.random())]),
            $(`<button class="button">`).text("リトライ").on("click", () => sceneController.changeScene(new GameScene())),
            $(`<button class="button">`).text("ステージセレクト").on("click", () => {}), // TODO:
        );
    }
}