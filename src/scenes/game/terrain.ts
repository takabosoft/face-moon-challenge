import { Rect } from "../../geometries/rect";
import { spriteSheet } from "../../spriteSheet";
import { ImageCollider } from "../../utils/imageCollider";

/**
 * 地形の描画、当たり判定を行います。
 */
export class Terrain {
    readonly imageCollider: ImageCollider;

    constructor(readonly spriteRect: Rect) {
        this.imageCollider = new ImageCollider(spriteSheet.getImageData(spriteRect));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        spriteSheet.drawSprite(ctx, 0, 0, this.spriteRect);
    }
}