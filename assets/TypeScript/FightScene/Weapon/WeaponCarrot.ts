import { WeaponData, WeaponLvlConfig, WeaponType } from "../../FarmScene/dts";
import { Config } from "../../FarmScene/Config";
import { PoolManager } from "../../Frame/PoolManager";
import { Util } from "../../Frame/Util";
import Bullet from "../Bullet";
import Weapon from "./Weapon";
import Pool from "../../Frame/Pool";
const {ccclass, property} = cc._decorator;
@ccclass
export default class WeaponCarrot extends Weapon {
    @property(Pool)
    bulletPool:Pool = null;
    @property({
        type: [cc.Node],
        displayName: "muzzlePos"
    })
    muzzlePos: cc.Node[] = [];

    private ROF:number = 1;
    private speed:number = 1;
    private muzzleEnableIdxs:number[] = [];
    onLoad(){
        this.lvlMax = Config.WeaponConfByType(WeaponType.Carrot).lvlConfs.length;
    }
    setLvl(lvl:number){
        this.lvl = lvl;
        let config = Config.WeaponLvlConfByTypeLvl(WeaponType.Carrot, lvl);
        this.ROF = config.ROF;
        this.speed = config.speed;
        this.muzzleEnableIdxs = config.muzzleEnableIdxs;
    }
    private timer = 0;
    update (dt) {
        if(!this.playing){
            return;
        }
        this.timer += dt;
        if(this.timer > 1/this.ROF){
            this.timer = 0;
            for(let i=0; i<this.muzzleEnableIdxs.length; i++){
                let idx = this.muzzleEnableIdxs[i];
                let muzzle = this.muzzlePos[idx];
                let bulletNode = this.bulletPool.getInstance(this.bulletParent);
                bulletNode.active = true;
                let pos = muzzle.convertToWorldSpaceAR(cc.Vec2.ZERO);
                pos = this.bulletParent.convertToNodeSpaceAR(pos);
                bulletNode.position = cc.v2(pos.x, pos.y);
                let bullet = bulletNode.getComponent(Bullet);
                let v = Util.radToVec2(muzzle.angle+Math.PI/2);
                bullet.fly(v.mulSelf(this.speed));
            }
        }
    }
}
