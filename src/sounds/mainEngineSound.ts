import { shortGainFade } from "./soundConst";

/**
 * メインエンジンサウンド
 * ホワイトノイズ → ゲイン（ショートフェード有り） → 出力
 */
export class MainEngineSound {
    private readonly gainNode: GainNode;
    private audioBufferSourceNode?: AudioBufferSourceNode;

    constructor(private readonly audioContext: AudioContext, private readonly whiteNoiseAudioBuffer: AudioBuffer, private readonly gain: number) {
        this.gainNode = audioContext.createGain();

        // ノード接続
        this.gainNode.connect(audioContext.destination);
    }

    play() {
        if (this.audioBufferSourceNode != null) { return; }
        this.audioBufferSourceNode = this.audioContext.createBufferSource();
        this.audioBufferSourceNode.buffer = this.whiteNoiseAudioBuffer;
        this.audioBufferSourceNode.loop = true;
        this.audioBufferSourceNode.playbackRate.value = 0.1;
        this.audioBufferSourceNode.connect(this.gainNode);
        this.gainNode.gain.value = 0;
        this.gainNode.gain.linearRampToValueAtTime(this.gain, this.audioContext.currentTime + shortGainFade);
        this.audioBufferSourceNode.start();
    }

    stop() {
        if (this.audioBufferSourceNode == null) { return; }
        const node = this.audioBufferSourceNode;
        this.audioBufferSourceNode = undefined;

        this.gainNode.gain.value = this.gain;
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + shortGainFade);
        node.stop(this.audioContext.currentTime + shortGainFade);
        node.onended = () => node.disconnect();
    }
}