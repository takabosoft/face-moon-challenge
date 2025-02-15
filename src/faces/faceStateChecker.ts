import { faceApi } from "./faceApiWrapper";
import type * as faceApiTypes from "face-api.js";

export interface FaceState {
    /** 口の開閉 */
    readonly isMouthOpen: boolean;
    /** 顔のY軸回転 */
    readonly yaw: number;
}

function calcDistance(pt1: faceApiTypes.IPoint, pt2: faceApiTypes.IPoint): number {
    const dx = pt2.x - pt1.x;
    const dy = pt2.y - pt1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

class FaceStateChecker {

    private isMouthOpen(landmarks: faceApiTypes.FaceLandmarks68): boolean {
        const mouth = landmarks.getMouth();
        const cx = calcDistance(mouth[0], mouth[6]);
        const cy = calcDistance(mouth[18], mouth[14]);
        if (cy == 0) { return false; }
        return cx / cy < 4;
    }

    /** 顔のY軸回転 */
    private calcYaw(landmarks: faceApiTypes.FaceLandmarks68): number {
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const nose = landmarks.getNose();

        // ロール（Roll）の計算
        const dx = rightEye[3].x - leftEye[0].x;
        const dy = rightEye[3].y - leftEye[0].y;
        const roll = Math.atan2(dy, dx); // ラジアン（rad）

        const eyeCenterX = (leftEye[0].x + rightEye[3].x) / 2;
        const eyeCenterY = (leftEye[0].y + rightEye[3].y) / 2;

        // 鼻の位置をロール補正した座標に変換
        const noseX = (nose[0].x - eyeCenterX) * Math.cos(roll) + (nose[0].y - eyeCenterY) * Math.sin(roll);
        //const noseY = (nose[0].y - eyeCenterY) * Math.cos(roll) - (nose[0].x - eyeCenterX) * Math.sin(roll);

        // Yawの計算
        return (noseX / dx) * 100; // 目の幅で正規化
    }

    /** 現在の顔の状態を取得します。 */
    async getFaceState(input: HTMLVideoElement | HTMLImageElement): Promise<FaceState | undefined> {
        const res = await faceApi.detectSingleFace(input);
        if (res == null) { return undefined; }
        return {
            isMouthOpen: this.isMouthOpen(res.landmarks),
            yaw: this.calcYaw(res.landmarks),
        }
    }
}

export const faceStateChecker = new FaceStateChecker();