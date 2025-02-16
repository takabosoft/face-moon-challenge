import { AnimationFrameRequester } from "./animationFrameRequester";

/**
 * シミュレーションは固定フレーム、レンダリングは可変フレームみたいにします。  
 * パーティクル移動など線形補間で十分なものはレンダリング側のイベントの利用を想定。
 */
export class FixedSimulationAnimator {
    private readonly frameRequester = new AnimationFrameRequester();
    private _fps = 0;

    constructor(private readonly simulationFps: number) {

    }

    get fps() { return this._fps; }

    /**
     * 60FPS環境で60固定フレームだと微妙な差がでて計算と固定フレームが合わない可能性が高い
     * @param onSimulation 固定フレームで厳密にやりたい処理
     * @param onRender 可変フレームで適用にやりたい処理
     */
    start(onSimulation: () => void, onRender: (deltaSec: number) => void): void {

        const simMS = 1000 / this.simulationFps;
        let lastTimeStampMS: number | undefined = undefined;
        let lastRenderTimeStampMS: number | undefined = undefined;
        let remainMS = 0;

        let lastFPSTimeStampMS = 0;
        let fpsCounter = 0;

        const frame = (timeStampMS: DOMHighResTimeStamp) => {
            if (lastTimeStampMS != null) {
                remainMS += Math.min(timeStampMS - lastTimeStampMS, 1000 / 15); // 15FPS以下はもたつきとします。

                let isSimUpdated = false;
                while (remainMS >= simMS) {
                    remainMS -= simMS;
                    onSimulation();
                    isSimUpdated = true;
                }

                
                if (true/*isSimUpdated*/) {
                    const deltaSec = lastRenderTimeStampMS == null ? 0 : (timeStampMS - lastRenderTimeStampMS) / 1000;
                    onRender(deltaSec);
                    lastRenderTimeStampMS = timeStampMS;

                    // FPS計算　1秒更新
                    if (timeStampMS > lastFPSTimeStampMS + 1000) {
                        lastFPSTimeStampMS = timeStampMS;
                        this._fps = fpsCounter;
                        fpsCounter = 0;
                    } else {
                        fpsCounter++;
                    }
                }
                
            }
            lastTimeStampMS = timeStampMS;
            this.frameRequester.request(frame);
        };

        this.frameRequester.request(frame);
    }

    stop() {
        this.frameRequester.cancel();
    }
}