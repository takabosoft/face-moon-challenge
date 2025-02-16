import { Vec2 } from "../geometries/vec2";
import { BitArray } from "./bitArray";

export class ImageCollider {
    readonly size: Vec2;
    private readonly bitArray: BitArray;

    constructor(imageData: ImageData) {
        this.size = new Vec2(imageData.width, imageData.height);
        this.bitArray = new BitArray(this.size.x * this.size.y);

        let destIdx = 0, srcIdx = 0;
        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                this.bitArray.set(destIdx, imageData.data[srcIdx + 3] > 0);
                destIdx++;
                srcIdx += 4;
            }
        }
    }

    hitTestPoint(x: number, y: number): boolean {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y) { return true; } // 外部は当たる
        return this.bitArray.get(y * this.size.x + x);
    }

    /**
     * 自分に対してimageが当たっているかを判定します。
     * @param xDest 
     * @param yDest 
     * @param image 
     * @returns 
     */
    hitTestImage(xDest: number, yDest: number, image: ImageCollider): boolean {
        const isRight = xDest % 1 > 0;
        const isBottom = yDest % 1 > 0;
        xDest = Math.floor(xDest);
        yDest = Math.floor(yDest);

        const checkOther = (x: number, y: number) => {
            if (x < 0 || x > mySize.x || y < 0 || y > mySize.y) { return true; }
            return this.bitArray.get(y * mySize.x + x);
        }

        const otherSize = image.size;
        const mySize = this.size;
        for (let y = 0; y < otherSize.y; y++) {
            const y2 = yDest + y;
            if (y2 < 0 || y2 >= mySize.y) { return true; }

            for (let x = 0; x < otherSize.x; x++) {
                if (image.bitArray.get(y * otherSize.x + x)) {
                    const x2 = xDest + x;
                    if (x2 < 0 || x2 >= mySize.y) { return true; }
                    if (this.bitArray.get(y2 * mySize.x + x2)) {
                        return true;
                    }

                    // 端数が出ている場合は他の隣接座標もチェックします（おもそう）
                    if (isRight && checkOther(x2 + 1, y2)) {
                        return true;
                    }
                    if (isBottom && checkOther(x2, y2 + 1)) {
                        return true;
                    }
                    if (isRight && isBottom && checkOther(x2 + 1, y2 + 1)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}