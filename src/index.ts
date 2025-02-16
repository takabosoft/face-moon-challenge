/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 */

import { faceApi } from "./faces/faceApiWrapper";
import { LoadingScene } from "./scenes/loading/loadingScene";
import { sceneController } from "./scenes/sceneController";

$(async () => {
    console.log("OK");
    new PageController().start();
});

class PageController {
    async start() {
        window.onunhandledrejection = e => {
            alert(e.reason);
        }
        $(document.body).append(sceneController.element);
        sceneController.changeScene(new LoadingScene());
    }
}
