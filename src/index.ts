/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 */

import { faceApi } from "./faces/faceApiWrapper";
import { SceneController } from "./sceneController";

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
    
        //await faceApi.readWeights();

        $(document.body).append(this.sceneController.element);
    }
}

if (0) {
    try {
        /*const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        const videoEl = $(`<video class="video" autoplay playsinline>`);
        const video = (videoEl[0] as HTMLVideoElement);
        video.srcObject = stream;
        $("main").append(videoEl);*/

   
        const logEl = $(`<div>`);

        let lastFPSTime = performance.now();
        let fpsCounter = 0;
        let fps = 0;

        /*let lastDetect = "";

        const nextDetect = async () => {
            const res = await faceStateChecker.getFaceState(video);
            lastDetect = `${res?.yaw}`;
            setTimeout(nextDetect, 0); // すぐに次の検出を開始
        };*/
        

        /*const onAnime = async (time: DOMHighResTimeStamp) => {
            fpsCounter++;
            if (time - lastFPSTime >= 1000) {
                lastFPSTime = time;
                fps = fpsCounter;
                fpsCounter = 0;
            }   
            //const detection = await faceapi.detectSingleFace(video, options).withFaceLandmarks(true);
            //logEl.text(`TEST: ${detection != null ? "検出" : "X"}, FPS: ${fps}`);
            logEl.text(`detect: ${lastDetect} FPS: ${fps}`);
            requestAnimationFrame(time => onAnime(time));
        }
        
        nextDetect();
        requestAnimationFrame(time => onAnime(time));*/

        $("main").append(
            $("<button>").text("TEST").on("click", async () => {
                //const res = await faceStateChecker.test(video);
                //logEl.text(`RES?: ${res}`);
            }),
            logEl,
        );
        
    } catch (e) {
        alert(e);
    }
}