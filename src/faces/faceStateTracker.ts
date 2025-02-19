import { TimeoutTimer } from "../animation/timeoutTimer";
import { Component } from "../components/component";
import { faceMoonChallengeLocalStorage } from "../data/faceMoonChallengeLocalStorage";
import { sceneController } from "../scenes/sceneController";
import { FaceState, faceStateChecker } from "./faceStateChecker";

export const enum VideoDisplayStyle {
    Off = "off",
    Dark = "dark",
    Normal = "normal",
}

interface VideoDisplayStyleInfo {
    readonly style: VideoDisplayStyle;
    readonly name: string;
}

export const videoDisplayStyleInfos: VideoDisplayStyleInfo[] = [
    { style: VideoDisplayStyle.Off, name: "オフ" },
    { style: VideoDisplayStyle.Dark, name: "暗くする" },
    { style: VideoDisplayStyle.Normal, name: "未加工" },
];

export class FaceStateTracker extends Component {
    private readonly videoEl = $(`<video class="video" autoplay playsinline>`);
    private _timeout = new TimeoutTimer();
    private _lastFaceState?: FaceState;
    private _isStarted = false;

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
        if (this.video.srcObject != null) { return; }
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        this.video.srcObject = stream;
    }

    async startTrack(): Promise<boolean> {
        if (this._isStarted) { return true; }
        try {
            await this.startVideoStream();
            /*no await*/ this.startTrackImpl();
            this._isStarted = true;
            return true;
        } catch (e) {
            sceneController.error(`カメラの初期化に失敗しました。\n${e}`);
            return false;
        }
    }

    private async startTrackImpl() {
        while (true) {
            this._lastFaceState = await faceStateChecker.getFaceState(this.video);
            await this._timeout.start(0);
        }
    }
}