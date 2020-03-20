import Bullet from "../Bullet";
import { FightSystem } from "../../Frame/FightSystem";
import ScreenRect from "../../Frame/ScreenRect";
import { Util } from "../../Frame/Util";
import WeaponBanana from "./WeaponBanana";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletBanana extends Bullet {

    protected flyOut = true;
    speed = 600;
    backSpeed = 1000;
    @property(WeaponBanana)
    weapon:WeaponBanana = null;
    backCallback = null;
    onLoad(){
        this.node.on(FightSystem.Event.BeatHper, this.onBeatHper, this);
        this.anim = this.getComponent(cc.Animation);
    }

    update (dt) {
        if(this.flyOut){
            this.node.position = this.node.position.add(cc.v2(0,this.speed*dt));
            if(this.node.position.y > ScreenRect.height/2){
                this.flyOut = false;
            }
        }else{
            let pos = Util.convertPosition(this.weapon.node, this.node.parent);
            this.node.position = Util.moveVec2(this.node.position, pos, this.backSpeed*dt);
            if(this.node.position.equals(pos) && this.backCallback){
                this.backCallback(this);
            }
        }
    }
    public fly(speed){
        this.speed = speed;
        this.flyOut = true;
        this.anim.play("Normal");
        Util.enableAllCollider(this.node);
        this.remainTimes = 10000;
    }
    public onBeatHper() {

    }

}
