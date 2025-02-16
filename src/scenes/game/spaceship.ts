import { MutableVec2 } from "../../geometries/mutableVec2";
import { Rect } from "../../geometries/rect";
import { Vec2 } from "../../geometries/vec2";
import { spriteInfos, spriteSheet } from "../../spriteSheet";
import { ImageCollider } from "../../utils/imageCollider";
import { Rgb } from "../../utils/rgb";
import { RgbRange } from "../../utils/rgbRange";
import { sceneController } from "../sceneController";
import { ParticleManager, ParticleStyle, ValueRange } from "./particleManager";
import { Terrain } from "./terrain";

const gravity = 0.02;
const mainEnginePower = 0.045;
const gusPower = 0.005;

const mainEngineParticleRect = new Rect(5, 15, 7 - 1, 1);
const mainEngineParticleStyle: ParticleStyle = {
    rgbRange: new RgbRange(new Rgb(188, 0, 0), new Rgb(255, 255, 160)),
    dir: new Vec2(0, 1),
    speedRange: new ValueRange(0.5, 3),
    lifeRange: new ValueRange(6, 9),
};

const leftGusParticleRect = new Rect(4, 4, 1, 2 - 1);
const leftGusParticleStyle: ParticleStyle = {
    rgbRange: new RgbRange(new Rgb(0, 244, 244), new Rgb(255, 255, 255)),
    dir: new Vec2(-1, 0),
    speedRange: new ValueRange(0.5, 2),
    lifeRange: new ValueRange(4, 7),
};

const rightGusParticleRect = new Rect(12, 4, 1, 2 - 1);
const rightGusParticleStyle: ParticleStyle = {
    ...leftGusParticleStyle,
    dir: new Vec2(+1, 0),
};

const yawThreshold = 6.5;

/** 宇宙船に関わる処理をまとめます。 */
export class Spaceship {
    private readonly imageCollider: ImageCollider;
    private readonly inertia = new MutableVec2(0, 0);
    private remainEnergy: number;

    constructor(private topLeft: MutableVec2, private readonly maxEnergy: number) {
        this.imageCollider = new ImageCollider(spriteSheet.getImageData(spriteInfos.spaceship));
        this.remainEnergy = maxEnergy;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        spriteSheet.drawSprite(ctx, this.topLeft.x, this.topLeft.y, spriteInfos.spaceship);
    }

    get energyRatio() { return Math.max(this.remainEnergy / this.maxEnergy, 0); }

    private get isMainEngineOn() { return sceneController.faceStateTracker.lastFaceState?.isMouthOpen ?? false; }
    private get isLeftGusOn() {  
        const yaw = sceneController.faceStateTracker.lastFaceState?.yaw;
        return yaw != null && yaw < -yawThreshold;
    }
    private get isRightGusOn() {  
        const yaw = sceneController.faceStateTracker.lastFaceState?.yaw;
        return yaw != null && yaw > +yawThreshold;
    }

    onSimulation(terrain: Terrain, particleMan: ParticleManager): void {
        this.inertia.y += gravity; // 重力加速度

        if (this.isMainEngineOn && this.remainEnergy > 0) {
            this.inertia.y -=  mainEnginePower;
            this.remainEnergy -= mainEnginePower;
            particleMan.generate(15, mainEngineParticleRect.offset(this.topLeft), mainEngineParticleStyle);
        }
        if (this.isLeftGusOn && this.remainEnergy > 0) {
            this.inertia.x += gusPower;
            this.remainEnergy -= gusPower;
            particleMan.generate(5, leftGusParticleRect.offset(this.topLeft), leftGusParticleStyle);
        } else if (this.isRightGusOn && this.remainEnergy > 0) {
            this.inertia.x -= gusPower;
            this.remainEnergy -= gusPower;
            particleMan.generate(5, rightGusParticleRect.offset(this.topLeft), rightGusParticleStyle);
        }

        const xNew = this.topLeft.x + this.inertia.x;
        const yNew = this.topLeft.y + this.inertia.y;

        if (!terrain.imageCollider.hitTestImage(this.topLeft.x, this.topLeft.y + 1, this.imageCollider)) {
            this.topLeft.x = xNew;
            this.topLeft.y = yNew;
        } else {
            
        }
    }
}