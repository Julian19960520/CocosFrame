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
import { timingSafeEqual } from "crypto";
import { PoolManager } from "../CocosFrame/PoolManager";
import { PrefabPath } from "../CocosFrame/Config";

const {ccclass, menu, property} = cc._decorator;
@ccclass
@menu('病毒/Virus4') 
//复制病毒
export default class Virus4 extends Virus {
    interval = 4;
    timer = 0;
    rotateSpeed = 20;
    start(){
        this.anima.play("idle"); 
    }
    update (dt) {
        if(!this.playing){
            return;
        }
        if(this.droping){
            this.updateDrop(dt);
            return;
        }
        this.timer +=dt;
        if(this.timer > this.interval){
            this.timer = 0;
            // this.division();  
        }
        if(this.velocity){
            this.node.angle += this.rotateSpeed*dt;
            this.node.position = this.node.position.add(this.velocity.mul(dt));
        }
    }
    onReturnPool(){
        super.onReturnPool();
        if(this.tw){
            this.tw.stop();
        }
    }
    private tw:cc.Tween = null;
    division(){
        let node = PoolManager.getInstance(PrefabPath.virus4);
        this.node.parent.addChild(node);
        let virus = node.getComponent(Virus);
        virus.node.x = this.node.x+this.node.width*this.node.scaleX;
        virus.node.y = this.node.y;
        virus.node.name = "divisioner";
        virus.node.scale = 0;
        virus.velocity = this.velocity;
        cc.log("division", this.node.name);
        // this.anima.stop();
        // this.tw = cc.tween(this.node).to(0.5,{scale:1.5})
        //     .call(()=>{
        //         let node = PoolManager.getInstance(PrefabPath.virus4);
        //         this.node.parent.addChild(node);
        //         let virus = node.getComponent(Virus);
        //         virus.node.x = this.node.x+this.node.width*this.node.scaleX;
        //         virus.node.y = this.node.y;
        //         virus.node.name = "divisioner";
        //         virus.node.scale = 0;
        //         virus.velocity = this.velocity;
        //         cc.tween(node).to(1, {scale:1})
        //             .call(()=>{

        //             }).start();
        //     })
        //     .to(1,{scale:1}).call(()=>{
        //         this.anima.play("idle");

        //     }).start();
        
    }
}
