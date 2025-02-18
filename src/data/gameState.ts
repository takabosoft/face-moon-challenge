import { stageInfos } from "./stageInfos";

class GameState {
    readonly urlParams = new URL(location.href).searchParams;

    stageIndex = 1;

    get stageInfo() {
        return stageInfos[this.stageIndex];
    }

    get isSoundTest() { return this.urlParams.get("soundTest") == "1"; }
}

export const gameState = new GameState();