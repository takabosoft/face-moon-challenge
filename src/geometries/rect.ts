import { MutableVec2 } from "./mutableVec2";
import { Vec2 } from "./vec2";

export class Rect {
    constructor(readonly x: number, readonly y: number, readonly width: number, readonly height: number) { }

    get left() { return this.x; }
    get top() { return this.y; }
    get right() { return this.x + this.width; }
    get bottom() { return this.y + this.height; }
    get center() { return new Vec2((this.left + this.right) / 2, (this.top + this.bottom) / 2); }
    get size() { return new Vec2(this.width, this.height); }
    get isEmpty() { return this.width <= 0 || this.height <= 0; }

    offset(offset: Vec2 | MutableVec2): Rect {
        return new Rect(this.x + offset.x, this.y + offset.y, this.width, this.height);
    }

    scale(s: number): Rect {
        return new Rect(this.x * s, this.y * s, this.width * s, this.height * s);
    }

    deflate(params: { left?: number, top?: number, right?: number, bottom?: number, all?: number }): Rect {
        const def = params.all ?? 0;
        return Rect.fromLeftTopRightBottom(
            this.left + (params.left ?? def),
            this.top + (params.top ?? def),
            this.right - (params.right ?? def),
            this.bottom - (params.bottom ?? def),
        )
    }

    private objectPosition(objectSize: Vec2): Rect {
        return new Rect((this.width - objectSize.x) / 2, (this.top + this.bottom - objectSize.y) / 2, objectSize.x, objectSize.y);
    }

    objectFitContain(objectSize: Vec2): Rect {
        if (this.isEmpty) { return Rect.zero; }
        const scale = Math.min(this.width / objectSize.x, this.height / objectSize.y);
        const scaledSize = objectSize.scale(scale);
        return this.objectPosition(scaledSize);
    }

    static fromSize(size: Vec2): Rect {
        return new Rect(0, 0, size.x, size.y);
    }

    static fromLeftTopRightBottom(left: number, top: number, right: number, bottom: number) {
        return new Rect(left, top, right - left, bottom - top);
    }

    static fromOuterBounds(e: JQuery): Rect {
        return new Rect(0, 0, e.outerWidth() ?? 0, e.outerHeight() ?? 0);
    }

    /** 空の矩形インスタンスです。 */
    static readonly zero = new Rect(0, 0, 0, 0);
}