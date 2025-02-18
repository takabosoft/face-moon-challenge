import { rndRange } from "../utils/random";
import { GusSound } from "./gusSound";
import { MainEngineSound } from "./mainEngineSound";
import { shortGainFade } from "./soundConst";

class SoundManager {
    private readonly audioContext = new AudioContext({ latencyHint: "interactive" });
    private readonly whiteNoiseAudioBuffer: AudioBuffer;
    readonly leftGusSound: GusSound;
    readonly rightGusSound: GusSound;
    readonly mainEngineSound: MainEngineSound;

    constructor() {
        document.addEventListener("pointerdown", () => this.audioContext.resume(), true);
        this.whiteNoiseAudioBuffer = this.generateWhiteNoise(2);
        this.leftGusSound = new GusSound(this.audioContext, this.whiteNoiseAudioBuffer, -1, 0.1);
        this.rightGusSound = new GusSound(this.audioContext, this.whiteNoiseAudioBuffer, +1, 0.1);
        this.mainEngineSound = new MainEngineSound(this.audioContext, this.whiteNoiseAudioBuffer, 0.1);
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

    /** 爆発音の再生 */
    playExplosion(): void {
        for (let i = 0; i < 5; i++) {
            this.playExplosionImp(rndRange(0, 0.1), rndRange(1.0, 1.6), rndRange(0.01, 0.03), 0.2);
        }
    }

    private playExplosionImp(offsetTime: number, duration = 1.5, rate = 0.01, gain = 0.5) {
        const playTime = this.audioContext.currentTime + offsetTime;

        const noise = this.audioContext.createBufferSource();
        noise.buffer = this.whiteNoiseAudioBuffer;
        noise.playbackRate.value = rate;
        noise.loop = true;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, playTime);
        gainNode.gain.linearRampToValueAtTime(gain, playTime + shortGainFade);
        gainNode.gain.exponentialRampToValueAtTime(0.01, playTime + duration);

        // ノードを接続
        noise.connect(gainNode).connect(this.audioContext.destination);

        // 再生開始
        noise.start(playTime);
        noise.stop(playTime + duration);

        noise.onended = () => {
            noise.disconnect();
            gainNode.disconnect();
        };
    }

    /** ボタンタップ音の再生 */
    playButtonTap() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // 音の設定
        oscillator.type = "sine";  // サイン波
        oscillator.frequency.setValueAtTime(1300, this.audioContext.currentTime);

        // ボリュームの設定
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        // 接続
        oscillator.connect(gainNode).connect(this.audioContext.destination);

        // 再生
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
        oscillator.onended = () => {
            oscillator.disconnect();
            gainNode.disconnect();
        }
    }

}

export const soundManager = new SoundManager();