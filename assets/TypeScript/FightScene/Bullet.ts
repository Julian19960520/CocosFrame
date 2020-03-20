import ScreenRect from "../Frame/ScreenRect";
import { PoolManager } from "../Frame/PoolManager";
import Damager from "../Frame/Damager";
import { FightSystem } from "../Frame/FightSystem";
import { Util } from "../Frame/Util";
import Pool from "../Frame/Pool";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends Damager {
    @property(Pool)
    pool: Pool = null;
    protected anim:cc.Animation = null;
    @property(cc.Vec2)
    velocity: cc.Vec2 = null;
    onLoad(){
        this.node.on(FightSystem.Event.BeatHper, this.onBeatHper, this);
        this.anim = this.getComponent(cc.Animation);
    }


    update (dt) {
        this.node.position = this.node.position.add(this.velocity.mul(dt));
        if(this.node.position.y > ScreenRect.height/2){
            this.pool.returnInstance(this.node);
        }
    }
    public fly(velocity:cc.Vec2){
        this.velocity = velocity;
        this.anim.play("Normal");
        Util.enableAllCollider(this.node);
        this.remainTimes = 1;
    }
    public onBeatHper() {
        this.anim.play("Spark");
        Util.disableAllCollider(this.node);
    }
    onAnimEnd(){
        this.pool.returnInstance(this.node);
    }
}
