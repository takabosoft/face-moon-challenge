import { TimeoutTimer } from "../animation/timeoutTimer";
import { Component } from "../components/component";
import { sceneController } from "../scenes/sceneController";
import { FaceState, faceStateChecker } from "./faceStateChecker";

export const enum FaceStateTrackerVideoStyle {
    Dark = "dark",
}

export class FaceStateTracker extends Component {
    private readonly videoEl = $(`<video class="video" autoplay playsinline>`);
    private _timeout = new TimeoutTimer();
    private _lastFaceState?: FaceState;

    constructor() {
        super();
        this.element = this.videoEl;
        this.videoEl.addClass(FaceStateTrackerVideoStyle.Dark);
    }

    private get video() { return (this.videoEl[0] as HTMLVideoElement); }
    get lastFaceState() { return this._lastFaceState; }

    private async startVideoStream() {
        if (this.video.srcObject != null) { return; }
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        this.video.srcObject = stream;
    }

    async startTrack(): Promise<boolean> {
        try {
            await this.startVideoStream();
            /*no await*/ this.startTrackImpl();
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