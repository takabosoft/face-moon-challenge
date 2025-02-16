import { Rect } from "./geometries/rect";
import { ImagePreloader } from "./imagePreloader";

export const spriteInfos = {
    stage1: new Rect(2, 2, 96, 156),
    ship: new Rect(101, 2, 17, 16),
} as const;


class SpriteSheet {
    private readonly canvas = $(`<canvas>`)[0] as HTMLCanvasElement;
    private ctx = this.canvas.getContext("2d")!;

    async load() {
        const img = new ImagePreloader("./spriteSheet.png");
        await img.load();
        this.canvas.width = img.img[0].naturalWidth;
        this.canvas.height = img.img[0].naturalHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img.img[0], 0, 0);
    }

    drawSprite(destCtx: CanvasRenderingContext2D, xDest: number, yDest: number, srcRect: Rect) {
        destCtx.drawImage(this.canvas, srcRect.x, srcRect.y, srcRect.width, srcRect.height, xDest, yDest, srcRect.width, srcRect.height);
    }
}

export const spriteSheet = new SpriteSheet();