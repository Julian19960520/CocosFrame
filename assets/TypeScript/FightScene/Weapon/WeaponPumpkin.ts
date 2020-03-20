import { WeaponData, WeaponLvlConfig, WeaponType } from "../../FarmScene/dts";
import { Config } from "../../FarmScene/Config";
import { Util } from "../../Frame/Util";
import Bullet from "../Bullet";
import Weapon from "./Weapon";
import Pool from "../../Frame/Pool";
import BulletBanana from "./BulletBanana";
const {ccclass, property} = cc._decorator;
@ccclass
export default class WeaponBanana extends Weapon {
    @property(Pool)
    bulletPool:Pool = null;
    @property(cc.Node)
    muzzle: cc.Node = null;
    @property(cc.Node)
    sight: cc.Node = null;
    
    private ROF:number = 1;
    private speed:number = 1;
    private backSpeed:number = 1;
    private cnt:number = 0;
    private maxCnt:number = 1;
    onLoad(){
        this.lvlMax = Config.WeaponConfByType(WeaponType.Banana).lvlConfs.length;
    }
    setLvl(lvl:number){
        this.lvl = lvl;
        let config = Config.WeaponLvlConfByTypeLvl(WeaponType.Banana, lvl);
        this.ROF = config.ROF;
        this.speed = config.speed;
        this.backSpeed = config.backSpeed;
        this.maxCnt = config.maxCnt;
    }
    private timer = 0;
    update (dt) {
        if(!this.playing){
            return;
        }
        this.timer += dt;
        if(this.timer > 1/this.ROF && this.cnt<this.maxCnt){
            this.timer = 0;
            this.cnt++;
            let bulletNode = this.bulletPool.getInstance(this.bulletParent);
            bulletNode.active = true;
            let pos = this.muzzle.convertToWorldSpaceAR(cc.Vec2.ZERO);
            pos = this.bulletParent.convertToNodeSpaceAR(pos);
            bulletNode.position = cc.v2(pos.x, pos.y);

            let bullet = bulletNode.getComponent(BulletBanana);
            bullet.speed = this.speed;
            bullet.speed = this.backSpeed;
            bullet.weapon = this;
            bullet.fly(this.speed);
            bullet.backCallback = this.bananaBackCall;
        }
    }
    bananaBackCall = (bulletBanana:BulletBanana)=>{
        this.cnt--;
        this.bulletPool.returnInstance(bulletBanana.node);
    };
}
