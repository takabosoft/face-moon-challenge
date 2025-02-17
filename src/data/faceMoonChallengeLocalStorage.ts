import { FaceStateTrackerVideoStyle } from "../faces/faceStateTracker";

const key = "face-moon-challenge";

interface FaceMoonChallengeLocalStorageParams {
    readonly clearStageIndex: number;
    readonly videoStyle: FaceStateTrackerVideoStyle;
}

export class FaceMoonChallengeLocalStorage {
    private _clearStageIndex = -1;
    private _videoStyle = FaceStateTrackerVideoStyle.Dark;

    constructor() {
        this.load();
    }

    get clearStageIndex() { return this._clearStageIndex; }
    set clearStageIndex(idx: number) {
        if (this._clearStageIndex != idx) {
            this._clearStageIndex = idx;
            this.save();
        }
    }

    get videoStyle() { return this._videoStyle; }
    set videoStyle(style: FaceStateTrackerVideoStyle) {
        this._videoStyle = style;
        this.save();
    }

    private load() {
        try {
            const jsonStr = localStorage.getItem(key);
            if (jsonStr == null) { return; }
            const params = JSON.parse(jsonStr) as FaceMoonChallengeLocalStorageParams;
            if (params == null) { return; }
            this._clearStageIndex = params.clearStageIndex;
            this._videoStyle = params.videoStyle;
        } catch (e) {
            console.error(e);
        }
    }

    private save() {
        const obj: FaceMoonChallengeLocalStorageParams = {
            clearStageIndex: this._clearStageIndex,
            videoStyle: this._videoStyle,
        };
        try {
            localStorage.setItem(key, JSON.stringify(obj));
        } catch (e) {
            console.error(e);
        }
    }
}

export const faceMoonChallengeLocalStorage = new FaceMoonChallengeLocalStorage();