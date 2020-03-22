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
import Virus from "./Virus";

const {ccclass, menu, property} = cc._decorator;
@ccclass
@menu('病毒/Virus3') 
//游动病毒
export default class Virus3 extends Virus {
    start(){
        this.anima.play("swim"); 
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
            this.node.position = this.node.position.add(this.velocity.mul(dt*this.ratio));
        }
    }
    private ratio = 0;
    step1(){
        this.ratio = 0;
        cc.tween(this)
            .to(0.25, {ratio:1}, {easing:"quadOut"})
            .to(3.75, {ratio:0}, {easing:"quadOut"})
            .start();
    }

    setVelocity(velocity){
        this.velocity = velocity;
        this.node.angle = Util.angle(this.velocity);
    }
}
