import { AnimationFrameRequester } from "./animationFrameRequester";

/**
 * @param delta 0.0～1.0 
 * @param sec 開始からの経過秒
 */
type DynamicFrameTweenAnimatorCallback = (delta: number, sec: number) => void;

export class DynamicFrameTweenAnimator {
    private animationFrame = new AnimationFrameRequester();
    private startTimestampMS = 0;
    private _isStarted = false;
    private callback: DynamicFrameTweenAnimatorCallback = () => { };
    private durationSec = 0;
    private onComp: () => void = () => { };

    constructor() { }

    get isStarted() { return this._isStarted; }

    start(durationSec: number, callback: DynamicFrameTweenAnimatorCallback): Promise<void> {
        return new Promise<void>(resolve => {
            this.stop();
            this.callback = callback;
            this.durationSec = durationSec;
            this.onComp = () => resolve();
            this.startTimestampMS = performance.now();
            this.animationFrame.request(ts => this.onFrame(ts));
            this._isStarted = true;
        });
    }

    stop(): void {
        this.animationFrame.cancel();
        this._isStarted = false;
    }

    private onFrame(timestampMS: DOMHighResTimeStamp): void {
        if (!this._isStarted) { return; }
        const delta = Math.max((timestampMS - this.startTimestampMS) / (this.durationSec * 1000), 0);
        if (delta >= 1) {
            this.callback(1, this.durationSec);
            this.stop();
            this.onComp();
            return;
        }
        this.callback(delta, delta * this.durationSec);
        this.animationFrame.request(ts => this.onFrame(ts));
    }
}