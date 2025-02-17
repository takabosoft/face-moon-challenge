



class SoundManager {
    private readonly audioContext = new AudioContext({ latencyHint: "interactive" });
    private readonly whiteNoiseAudioBuffer: AudioBuffer;

    constructor() {
        document.addEventListener("pointerdown", () => this.audioContext.resume(), true);
        this.whiteNoiseAudioBuffer = this.generateWhiteNoise(2);
    }

    /**
     * ホワイトノイズの生成関数
     * @param durationSec 
     * @param sampleRate 
     * @returns 
     */
    private generateWhiteNoise(durationSec: number, sampleRate = 44100): AudioBuffer {
        const buffer = this.audioContext.createBuffer(1, sampleRate * durationSec, sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) {
            output[i] = Math.random() * 2 - 1; // -1 から 1 の間のランダムな値
        }
        return buffer;
    }

    test() {
        const audioContext = this.audioContext;

        this.createExplosion();

        /*const noiseSource = this.audioContext.createBufferSource();
        noiseSource.buffer = this.whiteNoiseAudioBuffer;
        noiseSource.loop = true;*/

        // バンドパスフィルターを作成
        /*const filterNode = this.audioContext.createBiquadFilter();
        filterNode.type = "lowpass";  // バンドパスフィルター
        filterNode.frequency.value = 2000;  // フィルターの中心周波数を音程に合わせて変更
        filterNode.Q.value = 1.5;  // フィルターのQ値（広がり具合）

        // ノイズを再生
        noiseSource.connect(filterNode);
        filterNode.connect(this.audioContext.destination);
        
        noiseSource.start();*/
    }

    async createExplosion(duration = 1.5) {
        const currentTime = this.audioContext.currentTime;
        
        // ノイズ生成
        /*const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // ホワイトノイズを生成
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }*/

        // ノイズソース作成
        const noise = this.audioContext.createBufferSource();
        noise.buffer = this.whiteNoiseAudioBuffer;
        noise.playbackRate.setValueAtTime(0.01, currentTime);
        noise.loop = true;

        // ゲインノード設定
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(1, currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);
        gainNode.connect(this.audioContext.destination);

        // ノードを接続
        noise.connect(gainNode);
    
        // 再生開始
        noise.start(currentTime);
        noise.stop(currentTime + duration);
    }
}

/*

ガスはこれ
        const filterNode = this.audioContext.createBiquadFilter();
        filterNode.type = "bandpass";  // バンドパスフィルター
        filterNode.frequency.value = 10000;  // フィルターの中心周波数を音程に合わせて変更
        filterNode.Q.value = 1;  // フィルターのQ値（広がり具合）

メインエンジンはこれ
        const filterNode = this.audioContext.createBiquadFilter();
        filterNode.type = "lowpass";  // バンドパスフィルター
        filterNode.frequency.value = 2000;  // フィルターの中心周波数を音程に合わせて変更
        filterNode.Q.value = 1.5;  // フィルターのQ値（広がり具合）

sound → gain(gain + fadeout) → filter → output
が良さそう
*/

export const soundManager = new SoundManager();