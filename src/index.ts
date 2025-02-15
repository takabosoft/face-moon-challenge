/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 */

import { faceApi } from "./faces/faceApiWrapper";
import { LoadingScene } from "./scenes/loading/loadingScene";
import { SceneController } from "./scenes/sceneController";

$(async () => {
    console.log("OK");
    new PageController().start();
});

class PageController {
    private readonly sceneController = new SceneController();

    async start() {
        window.onunhandledrejection = e => {
            alert(e.reason);
        }
        $(document.body).append(this.sceneController.element);
        this.sceneController.changeScene(new LoadingScene());
    }
}
