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

    hitTestImage(xDest: number, yDest: number, image: ImageCollider): boolean {
        xDest = Math.floor(xDest);
        yDest = Math.floor(yDest);
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
                }
            }
        }
        return false;
    }
}