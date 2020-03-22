// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import ScreenRect from "../CocosFrame/ScreenRect";
import { Util } from "../CocosFrame/Util";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu('病毒/Virus') 
export default class Virus extends cc.Component {

    velocity:cc.Vec2 = null;
    anima:cc.Animation = null;
    angleSpeed = 180;
    g = 0;
    droping = false;
    active = true;
    playing = false;
    onLoad(){
        this.anima = this.getComponent(cc.Animation);
        this.node.on("outPool", this.onOutPool, this);
        this.node.on("returnPool", this.onReturnPool, this);
        this.onOutPool();
    }
    onOutPool(){
        this.droping = false;
        this.g = 0;
        this.active = true;
        this.playing = true;
    };
    onReturnPool(){}

    public pause(){
        this.playing = false;
    }
    public resume(){
        this.playing = true;
    }
    update (dt) {
        if(!this.playing){
            return;
        }
        if(this.droping){
            this.updateDrop(dt);
            return;
        }
        if(this.velocity){
            this.node.position = this.node.position.add(this.velocity.mul(dt));
        }
    }
    beginDrop(){
        this.droping = true;
        this.velocity = cc.v2( Util.random(-100, 100), Util.random(300, 500));
        this.g = 1200;
        this.active = false;
    }
    updateDrop(dt){
        if(this.velocity){
            this.velocity.y -= this.g*dt;
            this.node.angle += dt*this.angleSpeed;
            this.node.position = this.node.position.add(this.velocity.mul(dt));
        }
    }
    setVelocity(velocity){
        this.velocity = velocity;
    }
}
