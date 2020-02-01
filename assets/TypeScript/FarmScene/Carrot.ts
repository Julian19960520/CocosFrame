import ScreenRect from "../Frame/ScreenRect";
import { PoolManager } from "../Frame/PoolManager";
import Hper from "./Hper";
import Damager from "./Damager";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Carrot extends Damager {

    @property(cc.Vec2)
    velocity: cc.Vec2 = null;
    update (dt) {
        this.node.position = this.node.position.add(this.velocity.mul(dt));
        if(this.node.position.y > ScreenRect.height/2){
            PoolManager.returnInstance(this.node);
        }
    }
    public onCollisionEnter(other, self) {
        let otherNode:cc.Node = other.node;
        if(otherNode.group == "Pig"){
            let hper = otherNode.getComponent(Hper);
            if(hper){
                this.attack(hper);
                PoolManager.returnInstance(this.node);
            }
        }
    }
}
