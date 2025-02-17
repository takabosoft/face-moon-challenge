import { MutableVec2 } from "../../geometries/mutableVec2";
import { Rect } from "../../geometries/rect";
import { Vec2 } from "../../geometries/vec2";
import { spriteInfos, spriteSheet } from "../../spriteSheet";
import { ImageCollider } from "../../utils/imageCollider";
import { Rgb } from "../../utils/rgb";
import { RgbRange } from "../../utils/rgbRange";
import { sceneController } from "../sceneController";
import { Explosion } from "./explosion";
import { LandingZone } from "./landingZone";
import { ParticleManager, ParticleStyle, ValueRange } from "./particleManager";
import { Terrain } from "./terrain";

const gravity = 0.01; // 上げると難しい
const mainEnginePower = gravity * 3; // 2～5
const gusPower = 0.002;

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

const yawThreshold = 6.0;
const landingHitTestRect = new Rect(6, 17, 7, 1);
const landingOKThreshold = 0.5; // 甘めの判定

const enum SpaceshipState {
    /** 噴射とかはできるけどエネルギーは減らない＆移動しない */
    Ready = 0,
    /** プレイ中 */
    Play,
    /** 着陸成功 */
    Landing,
    /** 爆発 */
    Explosion,
}

/** 宇宙船に関わる処理をまとめます。 */
export class Spaceship {
    private readonly imageCollider: ImageCollider;
    private readonly inertia = new MutableVec2(0, 0);
    private remainEnergy: number;
    private explosion?: Explosion;
    private state = SpaceshipState.Ready;
    private landingCount = 0;

    constructor(private topLeft: MutableVec2, private readonly maxEnergy: number) {
        this.imageCollider = new ImageCollider(spriteSheet.getImageData(spriteInfos.spaceship));
        this.remainEnergy = maxEnergy;
    }

    get energyRatio() { return Math.max(this.remainEnergy / this.maxEnergy, 0); }
    get isExploded() { return this.state == SpaceshipState.Explosion && this.explosion != null && this.explosion.counter > 40; }
    get isLanded() { return this.state == SpaceshipState.Landing && this.landingCount > 40; }
    private get isMainEngineOn() { return sceneController.faceStateTracker.lastFaceState?.isMouthOpen ?? false; }
    private get isLeftGusOn() {  
        const yaw = sceneController.faceStateTracker.lastFaceState?.yaw;
        return yaw != null && yaw < -yawThreshold;
    }
    private get isRightGusOn() {  
        const yaw = sceneController.faceStateTracker.lastFaceState?.yaw;
        return yaw != null && yaw > +yawThreshold;
    }

    play() {
        if (this.state == SpaceshipState.Ready) {
            this.state = SpaceshipState.Play;
        }
    }

    onSimulation(terrain: Terrain, particleMan: ParticleManager, landingZone: LandingZone): void {
        if (this.state == SpaceshipState.Explosion) {
            this.explosion?.onSimulation();
            return;
        }
        if (this.state == SpaceshipState.Landing) {
            this.landingCount++;
            return;
        }

        // 慣性更新
        const isReady = this.state == SpaceshipState.Ready;
        const isPlay = this.state == SpaceshipState.Play;

        if (isPlay) {
            this.inertia.y += gravity;
        }

        if (isPlay || isReady) {
            if (this.isMainEngineOn && this.remainEnergy > 0) {
                if (isPlay) {
                    this.inertia.y -=  mainEnginePower;
                    this.remainEnergy -= mainEnginePower;
                }
                particleMan.generate(15, mainEngineParticleRect.offset(this.topLeft), mainEngineParticleStyle);
            }
            if (this.isLeftGusOn && this.remainEnergy > 0) {
                if (isPlay) {
                    this.inertia.x += gusPower;
                    this.remainEnergy -= gusPower;
                } 
                particleMan.generate(5, leftGusParticleRect.offset(this.topLeft), leftGusParticleStyle);
            } else if (this.isRightGusOn && this.remainEnergy > 0) {
                if (isPlay) {
                    this.inertia.x -= gusPower;
                    this.remainEnergy -= gusPower;
                }
                particleMan.generate(5, rightGusParticleRect.offset(this.topLeft), rightGusParticleStyle);
            }
        }

        const xNew = this.topLeft.x + this.inertia.x;
        const yNew = this.topLeft.y + this.inertia.y;
        if (!terrain.imageCollider.hitTestImage(xNew, yNew, this.imageCollider)) {
            // 何も当たらなかったので進める
            this.topLeft.x = xNew;
            this.topLeft.y = yNew;
            return;
        }
        // 何かと当たった

        // 着陸場所か？
        const testRect = landingHitTestRect.offset(this.topLeft).union(landingHitTestRect.offset(new Vec2(xNew, yNew)));
        if (!testRect.intersect(landingZone.rect).isEmpty && this.inertia.y <= landingOKThreshold) {
            this.topLeft.y = landingZone.rect.y - landingHitTestRect.y + 1;
            this.state = SpaceshipState.Landing;
            return;
        }
        
        // 爆発
        this.state = SpaceshipState.Explosion;
        this.explosion = new Explosion(new Vec2(this.topLeft.x + spriteInfos.spaceship.width / 2, this.topLeft.y + spriteInfos.spaceship.height / 2));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        let alpha = 1;
        if (this.explosion != null) {
            // 爆発時はフェードアウトさせます。
            alpha = 1 - Math.min(this.explosion.counter / 50, 1);
        }
        spriteSheet.drawSprite(ctx, this.topLeft.x, this.topLeft.y, spriteInfos.spaceship, alpha);
        this.explosion?.draw(ctx);
    }
}