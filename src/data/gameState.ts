import { stageInfos } from "./stageInfos";

class GameState {
    stageIndex = 1;

    get stageInfo() {
        return stageInfos[this.stageIndex];
    }
}

export const gameState = new GameState();