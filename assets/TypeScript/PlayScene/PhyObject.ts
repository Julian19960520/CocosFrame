// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Util } from "../CocosFrame/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PhyObject extends cc.Component {
    velocity:cc.Vec2 = cc.Vec2.ZERO;
    angleSpeed = 180;
    g = 800;
    update (dt) {
        if(this.velocity){
            this.velocity.y -= this.g*dt;
            this.node.angle += dt*this.angleSpeed;
            this.node.position = this.node.position.add(this.velocity.mul(dt));
        }
    }
}
