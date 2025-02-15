import type * as faceApiTypes from "face-api.js";
declare const faceapi: typeof import("face-api.js");

const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 32 * 5, scoreThreshold: 0.2 });

/**
 * face-api.js系の処理をまとめます。
 * - 例外系がtry-catchでキャッチできない問題を抱えています（原因不明）。
 */
class FaceApiWrapper {

    async readWeights() {
        return Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri("./weights/"),
            faceapi.nets.faceLandmark68TinyNet.loadFromUri("./weights/")
        ]);
    }

    async detectSingleFace(input: HTMLVideoElement | HTMLImageElement) {
        if (input instanceof HTMLVideoElement) {
            // 動画が流れていない間に検出を実行するとawaitが完了しない？（例外も発生しない？）ため回避策を入れます。
            if (input.readyState < 3) {
                return undefined;
            }
        }
        return faceapi.detectSingleFace(input, options).withFaceLandmarks(true);
    }
}

export const faceApi = new FaceApiWrapper();