import { Rect } from "../../geometries/rect";

/** 着陸場所を光らせるだけ */
export class LandingZone {
    private phase = 0;
    private readonly gradRect: Rect;

    constructor(readonly rect: Rect) {
        this.gradRect = Rect.fromLeftTopRightBottom(this.rect.left, this.rect.top - 16, this.rect.right, this.rect.bottom);
    }

    onSimulation(): void {
        this.phase += 0.005;
        this.phase %= 1;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const rc = this.gradRect;
        const gradient = ctx.createLinearGradient(rc.left, rc.top, rc.left, rc.bottom);
        gradient.addColorStop(0, "rgba(0, 128, 0, 0)");
        gradient.addColorStop(1, `rgba(0, 128, 0, ${Math.abs(Math.sin(this.phase * Math.PI * 2)) * 0.4 + 0.1}) `);

        
        ctx.fillStyle = gradient;
        ctx.fillRect(rc.left, rc.top, rc.width, rc.height);
    }
}