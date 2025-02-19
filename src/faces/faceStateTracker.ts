import { TimeoutTimer } from "../animation/timeoutTimer";
import { Component } from "../components/component";
import { faceMoonChallengeLocalStorage } from "../data/faceMoonChallengeLocalStorage";
import { sceneController } from "../scenes/sceneController";
import { FaceState, faceStateChecker } from "./faceStateChecker";
import { VideoDisplayStyle, videoDisplayStyleInfos } from "./videoDisplayStyle";

export class FaceStateTracker extends Component {
    private readonly videoEl = $(`<video class="video" muted playsinline>`);
    private _timeout = new TimeoutTimer();
    private _lastFaceState?: FaceState;
    private _isStarted = false;
    private _detecting = false;

    constructor() {
        super();
        this.element = this.videoEl;
        this.videoDisplayStyle = faceMoonChallengeLocalStorage.videoDisplayStyle;
    }

    private get video() { return (this.videoEl[0] as HTMLVideoElement); }
    
    get lastFaceState() { return this._lastFaceState; }

    set videoDisplayStyle(s: VideoDisplayStyle) {
        this.videoEl.removeClass(videoDisplayStyleInfos.map(s => s.style));
        this.videoEl.addClass(s);
    }

    private async startVideoStream() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
        });

        // face-apiで検出中にビデオを切り替えると駄目そうなので回避策を入れます。
        while (this._detecting) {
            await new Promise(r => setTimeout(r, 0));
        }
        this.video.pause();
        this.video.srcObject = null;
        this.video.srcObject = stream;
        this.video.play();
    }

    async startTrack(): Promise<boolean> {
        try {
            await this.startVideoStream();
            if (!this._isStarted) {
                /*no await*/ this.startTrackImpl();
                this._isStarted = true;
            }
            return true;
        } catch (e) {
            sceneController.error(`カメラの初期化に失敗しました。\n${e}`);
            return false;
        }
    }

    private async startTrackImpl() {
        while (true) {
            this._detecting = true;
            this._lastFaceState = await faceStateChecker.getFaceState(this.video);
            this._detecting = false;
            await this._timeout.start(0);
        }
    }
}