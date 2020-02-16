import { PoolManager } from "../Frame/PoolManager";
import Bullet from "./Bullet";
import { Util } from "../Frame/Util";
import { Config } from "../FarmScene/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Weapon extends cc.Component {

    @property({
        type: [cc.Node],
        displayName: "muzzle"
    })
    muzzleArr: cc.Node[] = [];
    bulletGroup: cc.Node = null;

    data:any = null;
    config:any = null;
    private timer = 0;

    private playing = false;
    public play(){
        this.playing = true;
    }
    public stop(){
        this.playing = false;
    }
    setData(data){
        this.data = data;
        this.config = Config.WeaponLvlConfByTypeLvl(data.type, data.lvl);
        PoolManager.preload([
            this.config.prefabPath
        ]);
    }
    update (dt) {
        if(!this.playing){
            return;
        }
        if(!this.config){
            return;
        }
        this.timer += dt;
        if(this.timer > 1/this.config.ROF){
            this.timer = 0;
            for(let i=0; i<this.muzzleArr.length; i++){
                let muzzle = this.muzzleArr[i];
                let bulletNode = PoolManager.getInstance(this.config.prefabPath);
                bulletNode.active = true;
                this.bulletGroup.addChild(bulletNode);
                let pos = muzzle.convertToWorldSpaceAR(cc.Vec2.ZERO);
                pos = this.bulletGroup.convertToNodeSpaceAR(pos);
                bulletNode.position = cc.v2(pos.x, pos.y);
                let bullet = bulletNode.getComponent(Bullet);
                let v = Util.radToVec2(muzzle.angle+Math.PI/2);
                bullet.fly(v.mulSelf(this.config.speed));
            }
        }
    }
}
