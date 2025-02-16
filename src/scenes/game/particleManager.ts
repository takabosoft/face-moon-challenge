import { Rect } from "../../geometries/rect";
import { Vec2 } from "../../geometries/vec2";
import { RgbRange } from "../../utils/rgbRange";

const limitParticles = 500;

function rndRange(v1: number, v2: number): number {
    const a = Math.random();
    return v1 * (1 - a) + v2 * a;
}

export interface ParticleStyle {
    readonly rgbRange: RgbRange;
    readonly dir: Vec2;
    readonly speedRange: ValueRange;
    readonly lifeRange: ValueRange;
}

export class ParticleManager {
    private counter = 0;
    private readonly particles: Particle[] = [];

    constructor() { }

    generate(count: number, rect: Rect, style: ParticleStyle): void {
        for (let i = 0; i < count; i++) {
            const life = style.lifeRange.rnd();
            const startPos = new Vec2(rndRange(rect.left, rect.right), rndRange(rect.top, rect.bottom));
            const speed = style.speedRange.rnd();
            const endPos = new Vec2(startPos.x + style.dir.x * life * speed, startPos.y + style.dir.y * life * speed);
            this.particles.push(new Particle(this.counter, this.counter + life, startPos, endPos, style.rgbRange.rnd()));
        }
        if (this.particles.length > limitParticles) {
            this.particles.splice(0, this.particles.length - limitParticles);
        }
    }

    onSimulation(): void {
        this.counter++;
    }

    draw(ctx: CanvasRenderingContext2D): void {

        const old = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = "lighter";

        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (this.particles[i].endCounter <= this.counter) {
                this.particles.splice(i, 1);
                continue;
            }
            this.particles[i].draw(ctx, this.counter);
        }

        ctx.globalCompositeOperation = old;
    }
}

export class ValueRange {
    constructor(
        readonly v1: number,
        readonly v2: number,
    ) {
    }

    rnd() { return rndRange(this.v1, this.v2); }
}

class Particle {
    constructor(
        readonly startCounter: number,
        readonly endCounter: number,
        readonly startPos: Vec2,
        readonly endPos: Vec2,
        readonly color: string,
    ) {
        //console.log(this.color);
    }

    draw(ctx: CanvasRenderingContext2D, counter: number): void {
        const a = (counter - this.startCounter) / (this.endCounter - this.startCounter);
        //console.log(a);
        const x = this.startPos.x * (1 - a) + this.endPos.x * a;
        const y = this.startPos.y * (1 - a) + this.endPos.y * a;
        const op = 1 - a * 0.7;
        //console.log(x, y);
        
        ctx.fillStyle = this.color + Math.floor(op * 255).toString(16).padStart(0, "0");
        ctx.fillRect(x, y, 1, 1);
    }
}