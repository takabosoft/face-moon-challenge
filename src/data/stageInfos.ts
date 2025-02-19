import { Rect } from "../geometries/rect";
import { Vec2 } from "../geometries/vec2";
import { spriteInfos } from "./spriteSheet";

export interface StageInfo {
    /** ステージ名 */
    readonly title: string;
    /** 地形テクスチャ */
    readonly terrainRect: Rect;
    /** 着陸場所 */
    readonly landingZone: Rect;
    /** 宇宙船初期値 */
    readonly starshipPos: Vec2;
    /** 初期エネルギー */
    readonly energy: number;
}

export const stageInfos: readonly StageInfo[] = [
    {
        title: "1. かんたん",
        terrainRect: spriteInfos.stage1Terrain,
        landingZone: new Rect(29, 139, 38, 1),
        starshipPos: new Vec2((spriteInfos.stage1Terrain.width - spriteInfos.spaceship.width) / 2, 16),
        energy: 15,
    },
    {
        title: "2. 見習い",
        terrainRect: spriteInfos.stage2Terrain,
        landingZone: new Rect(50, 140, 38, 1),
        starshipPos: new Vec2(32, 16),
        energy: 15,
    },
    {
        title: "3. 一人前",
        terrainRect: spriteInfos.stage3Terrain,
        landingZone: new Rect(2, 49, 38, 1),
        starshipPos: new Vec2(58, 104),
        energy: 15,
    },
    {
        title: "4. ベテラン",
        terrainRect: spriteInfos.stage4Terrain,
        landingZone: new Rect(101, 140, 27, 1),
        starshipPos: new Vec2(10, 98),
        energy: 15,
    },
    {
        title: "5. 神フェイス",
        terrainRect: spriteInfos.stage5Terrain,
        landingZone: new Rect(115, 84, 27, 1),
        starshipPos: new Vec2(68, 23),
        energy: 15,
    }
];