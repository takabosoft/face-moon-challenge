import { TimeoutTimer } from "../animation/timeoutTimer";
import { Component } from "../components/component";
import { SceneController } from "../scenes/sceneController";
import { FaceState, faceStateChecker } from "./faceStateChecker";

export class FaceStateTracker extends Component {
    private readonly videoEl = $(`<video class="video" autoplay playsinline>`);
    private _timeout = new TimeoutTimer();
    private _lastFaceState?: FaceState;

    constructor(private readonly sceneController: SceneController) {
        super();
        this.element = this.videoEl;
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

    async startTrack() {
        try {
            await this.startVideoStream();
            /*no await*/ this.startTrackImpl();
        } catch (e) {
            this.sceneController.error(`カメラの初期化に失敗しました。\n${e}`);
        }
    }

    private async startTrackImpl() {
        while (true) {
            this._lastFaceState = await faceStateChecker.getFaceState(this.video);
            await this._timeout.start(0);
        }
    }
}