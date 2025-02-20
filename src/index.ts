/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 */

import { faceMoonChallengeLocalStorage } from "./data/faceMoonChallengeLocalStorage";
import { gameState } from "./data/gameState";
import { sceneController } from "./scenes/sceneController";
import { SoundTestScene } from "./scenes/sound_test/soundTestScene";
import { TermsScene } from "./scenes/terms/termsScene";

$(async () => new PageController().start());

class PageController {
    async start() {
        /*window.onunhandledrejection = e => {
            alert(e.reason);
        }*/

        if (gameState.isResetData) {
            faceMoonChallengeLocalStorage.clearStageIndex = -1;
            history.replaceState(null, "", "/");
        }

        $(document.body).append(sceneController.element);
        sceneController.changeScene(gameState.isSoundTest ? new SoundTestScene() : new TermsScene());

        // キーボード操作による誤作動を回避します。
        window.addEventListener("keydown", e => {
            if (e.target instanceof HTMLButtonElement && (e.key == "Enter" || e.key == " ")) {
                e.preventDefault();
            }
        }, true);
    }
}
