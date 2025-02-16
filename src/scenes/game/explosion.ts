import { Vec2 } from "../../geometries/vec2";
import { spriteInfos, spriteSheet } from "../../spriteSheet";
import { rndRange } from "../../utils/random";

/** 爆裂魔法 */
export class Explosion {
    private _counter = 0;
    private readonly particles: ExpParticle[] = [];

    constructor(target: Vec2) {
        for (let i = 0; i < 250; i++) {
            const startCounter = rndRange(0, 40);
            const endCounter = startCounter + rndRange(20, 40);
            const a = Math.random() * Math.PI * 2;
            const startDis = Math.random() * 10;
            const endDis = startDis + rndRange(10, 20);

            const startPos = new Vec2(target.x + Math.cos(a) * startDis, target.y + Math.sin(a) * startDis);
            const endPos = new Vec2(target.x + Math.cos(a) * endDis, target.y + Math.sin(a) * endDis);
            const startRad = rndRange(0, Math.PI * 2);
            this.particles.push(new ExpParticle(startCounter, endCounter, startPos, endPos, startRad, startRad + rndRange(-Math.PI * 1, Math.PI * 1), rndRange(0.2, 1.5)));
        }
    }

    get counter() { return this._counter; }

    onSimulation() {
        this._counter++;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const old = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = "lighter";

        const counter = this._counter;
        for (const p of this.particles) {
            if (counter >= p.startCounter && counter <= p.endCounter) {
                p.draw(ctx, counter);
            }
        }

        ctx.globalCompositeOperation = old;
    }
}

class ExpParticle {
    constructor(
        readonly startCounter: number,
        readonly endCounter: number,
        readonly startPos: Vec2,
        readonly endPos: Vec2,
        readonly startImgRotateRad: number,
        readonly endImgRotateRad: number,
        readonly imgScale: number,
    ) {
    }

    draw(ctx: CanvasRenderingContext2D, counter: number): void {
        const a = (counter - this.startCounter) / (this.endCounter - this.startCounter);
        const x = this.startPos.x * (1 - a) + this.endPos.x * a;
        const y = this.startPos.y * (1 - a) + this.endPos.y * a;
        const op = 1 - a;
        const rot = this.startImgRotateRad * (1 - a) + this.endImgRotateRad * a;

        const src = spriteInfos.explosion;
        spriteSheet.drawSprite(ctx, x - src.width / 2, y - src.height / 2, src, op, rot, this.imgScale);
    }
}