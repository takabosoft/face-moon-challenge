import { Rect } from "../geometries/rect";
import { ImagePreloader } from "../utils/imagePreloader";

export const spriteInfos = {
    stage1Terrain: new Rect(2, 2, 96, 156),
    stage2Terrain: new Rect(140, 2, 96, 156),
    stage3Terrain: new Rect(239, 2, 96, 156),
    stage4Terrain: new Rect(338, 2, 137, 156),
    spaceship: new Rect(101, 2, 17, 16),
    explosion: new Rect(121, 2, 16, 14),
    instruction1: new Rect(2, 161, 81, 56),
    instruction2: new Rect(86, 161, 81, 56),
} as const;


class SpriteSheet {
    private readonly canvas = $(`<canvas>`)[0] as HTMLCanvasElement;
    private ctx = this.canvas.getContext("2d")!;

    async load() {
        const img = new ImagePreloader("./spriteSheet.png?rev=0");
        await img.load();
        this.canvas.width = img.img[0].naturalWidth;
        this.canvas.height = img.img[0].naturalHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img.img[0], 0, 0);
    }

    getImageData(srcRect: Rect): ImageData {
        return this.ctx.getImageData(srcRect.x, srcRect.y, srcRect.width, srcRect.height);
    }

    drawSprite(destCtx: CanvasRenderingContext2D, xDest: number, yDest: number, srcRect: Rect, alpha = 1, rotateRad = 0, scale = 1) {
        if (alpha != 1) {
            destCtx.globalAlpha = alpha;
        }

        if (rotateRad != 0 || scale != 1) {
            const xCenter = xDest + srcRect.width / 2;
            const yCenter = yDest + srcRect.height / 2;
            const oldTransform = destCtx.getTransform();
            destCtx.translate(+xCenter, +yCenter);
            destCtx.rotate(rotateRad);
            destCtx.scale(scale, scale);
            destCtx.translate(-xCenter, -yCenter);
            destCtx.drawImage(this.canvas, srcRect.x, srcRect.y, srcRect.width, srcRect.height, xDest, yDest, srcRect.width, srcRect.height);
            destCtx.setTransform(oldTransform);
        } else {
            destCtx.drawImage(this.canvas, srcRect.x, srcRect.y, srcRect.width, srcRect.height, xDest, yDest, srcRect.width, srcRect.height);
        }
        
        if (alpha != 1) {
            destCtx.globalAlpha = 1;
        }
    }
}

export const spriteSheet = new SpriteSheet();