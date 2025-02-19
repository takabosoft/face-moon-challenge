import { VideoDisplayStyle, videoDisplayStyleInfos } from "../faces/videoDisplayStyle";

const key = "face-moon-challenge";

interface FaceMoonChallengeLocalStorageParams {
    readonly clearStageIndex: number;
    readonly videoDisplayStyle: VideoDisplayStyle;
}

export class FaceMoonChallengeLocalStorage {
    private _clearStageIndex = -1;
    private _videoDisplayStyle = VideoDisplayStyle.Dark;

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

    get videoDisplayStyle() { return this._videoDisplayStyle; }
    set videoDisplayStyle(style: VideoDisplayStyle) {
        this._videoDisplayStyle = style;
        this.save();
    }

    private load() {
        try {
            const jsonStr = localStorage.getItem(key);
            if (jsonStr == null) { return; }
            const params = JSON.parse(jsonStr) as FaceMoonChallengeLocalStorageParams;
            if (params == null) { return; }
            this._clearStageIndex = params.clearStageIndex;
            if (videoDisplayStyleInfos.find(info => info.style == params.videoDisplayStyle)) {
                this._videoDisplayStyle = params.videoDisplayStyle;
            }
        } catch (e) {
            console.error(e);
        }
    }

    private save() {
        const obj: FaceMoonChallengeLocalStorageParams = {
            clearStageIndex: this._clearStageIndex,
            videoDisplayStyle: this._videoDisplayStyle,
        };
        try {
            localStorage.setItem(key, JSON.stringify(obj));
        } catch (e) {
            console.error(e);
        }
    }
}

export const faceMoonChallengeLocalStorage = new FaceMoonChallengeLocalStorage();