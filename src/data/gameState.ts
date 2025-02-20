import { stageInfos } from "./stageInfos";

class GameState {
    readonly urlParams = new URL(location.href).searchParams;

    /** 今遊んでいるステージ */
    stageIndex = 0;

    get stageInfo() {
        return stageInfos[this.stageIndex];
    }

    get isSoundTest() { return this.urlParams.get("soundTest") == "1"; }
    get isResetData() { return this.urlParams.get("reset") == "1"; }
}

export const gameState = new GameState();