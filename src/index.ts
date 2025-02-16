/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 */

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

        // キーボード操作による誤作動を回避します。
        window.addEventListener("keydown", e => {
            if (e.target instanceof HTMLButtonElement && (e.key == "Enter" || e.key == " ")) {
                e.preventDefault();
            }
        }, true);
    }
}
