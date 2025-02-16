import { MutableVec2 } from "../../geometries/mutableVec2";
import { Vec2 } from "../../geometries/vec2";
import { spriteInfos, spriteSheet } from "../../spriteSheet";
import { ImageCollider } from "../../utils/imageCollider";
import { Terrain } from "./terrain";

/** 宇宙船に関わる処理をまとめます。 */
export class Spaceship {
    private readonly imageCollider: ImageCollider;
    private readonly inertia = new MutableVec2(0, 0);

    constructor(private topLeft: MutableVec2) {
        this.imageCollider = new ImageCollider(spriteSheet.getImageData(spriteInfos.spaceship));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        spriteSheet.drawSprite(ctx, this.topLeft.x, this.topLeft.y, spriteInfos.spaceship);
    }

    onSimulation(terrain: Terrain): void {
        this.inertia.y += 0.03; // 重力加速度

        const xNew = this.topLeft.x + this.inertia.x;
        const yNew = this.topLeft.y + this.inertia.y;

        if (!terrain.imageCollider.hitTestImage(this.topLeft.x, this.topLeft.y + 1, this.imageCollider)) {
            this.topLeft.x = xNew;
            this.topLeft.y = yNew;
        } else {
            
        }

        
    }
}