import { GusSound } from "./gusSound";
import { MainEngineSound } from "./mainEngineSound";

class SoundManager {
    private readonly audioContext = new AudioContext({ latencyHint: "interactive" });
    private readonly whiteNoiseAudioBuffer: AudioBuffer;
    readonly leftGusSound: GusSound;
    readonly rightGusSound: GusSound;
    readonly mainEngineSound: MainEngineSound;

    constructor() {
        document.addEventListener("pointerdown", () => this.audioContext.resume(), true);
        this.whiteNoiseAudioBuffer = this.generateWhiteNoise(2);
        this.leftGusSound = new GusSound(this.audioContext, this.whiteNoiseAudioBuffer, -1, 0.3);
        this.rightGusSound = new GusSound(this.audioContext, this.whiteNoiseAudioBuffer, +1, 0.3);
        this.mainEngineSound = new MainEngineSound(this.audioContext, this.whiteNoiseAudioBuffer, 0.5);
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
}

export const soundManager = new SoundManager();