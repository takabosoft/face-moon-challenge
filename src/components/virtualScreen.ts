import { Component } from "./component";
import { Vec2 } from "../geometries/vec2";
import { Rect } from "../geometries/rect";

export class VirtualScreen extends Component {
    private _rect: Rect;

    constructor(readonly size: Vec2) {
        super();
        this.element = $(`<div class="screen">`).css({
            width: size.x,
            height: size.y,
        });
        this._rect = new Rect(0, 0, size.x, size.y);
    }

    get rect() { return this._rect; }
    get scale() { return this._rect.width / this.size.x; }

    layout(rect: Rect): void {
        this._rect = rect;
        this.element.css("transform", `translate(${rect.x}px, ${rect.y}px) scale(${this.scale})`);
    }
}