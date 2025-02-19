import { Button } from "../../components/button";
import { LoadingScene } from "../loading/loadingScene";
import { Scene } from "../scene";
import { sceneController } from "../sceneController";

const msgs = [
    "本ゲームは iPhone 15 Max でのみ動作検証を行っています。それ以前の端末では正常に動作しない可能性があります。",
    "このゲームはカメラを使用します。次の画面でカメラの使用を許可してください。カメラの映像はゲーム以外の目的では使用しません。",
    "顔の動きを利用するゲームですが、身体に痛みなどの異常を感じた場合は、ただちにゲームを中止し、医師の指示に従ってください。",
    "効果音が鳴ります。音量にご注意ください。",
    "ゲーム配信や紹介動画の作成は大歓迎です。許可は不要です。",
    "本ゲームに関連して発生したいかなるトラブルについて、開発者は一切の責任を負いません。",
];

/** 利用規約 */
export class TermsScene extends Scene {
    constructor() {
        super("term-scene");
        this.element.append(
            $(`<div class="title">`).text("利用規約"),
            $(`<ul>`).append(msgs.map(m => $(`<li>`).text(m))),
            new Button("同意して進む", () => sceneController.changeScene(new LoadingScene())).element
        );
    }
}