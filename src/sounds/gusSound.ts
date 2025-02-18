import { shortGainFade } from "./soundConst";

/**
 * ガスサウンド  
 * ホワイトノイズ → フィルター → ゲイン（ショートフェード有り） → パナー → 出力
 */
export class GusSound {
    private readonly bandFilterNode: BiquadFilterNode;
    private readonly gainNode: GainNode;
    private audioBufferSourceNode?: AudioBufferSourceNode;

    constructor(private readonly audioContext: AudioContext, private readonly whiteNoiseAudioBuffer: AudioBuffer, panValue: number, private readonly gain: number) {

        // バンドパスファイルター
        this.bandFilterNode = audioContext.createBiquadFilter();
        this.bandFilterNode.type = "bandpass";
        this.bandFilterNode.frequency.value = 10000;
        this.bandFilterNode.Q.value = 1;

        this.gainNode = audioContext.createGain();

        const pannerNode = audioContext.createStereoPanner();
        pannerNode.pan.value = panValue;

        // ノード接続
        this.bandFilterNode.connect(this.gainNode).connect(pannerNode).connect(audioContext.destination);
    }

    play() {
        if (this.audioBufferSourceNode != null) { return; }
        this.audioBufferSourceNode = this.audioContext.createBufferSource();
        this.audioBufferSourceNode.buffer = this.whiteNoiseAudioBuffer;
        this.audioBufferSourceNode.loop = true;
        this.audioBufferSourceNode.connect(this.bandFilterNode);
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