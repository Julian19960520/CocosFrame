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

const {ccclass, property} = cc._decorator;

@ccclass
export default class Virus extends cc.Component {

    velocity:cc.Vec2 = null;
    start () {

    }

    update (dt) {
        if(this.velocity){
            this.node.position = this.node.position.add(this.velocity.mul(dt));
        }
    }
    onCollisionExit(other:cc.Collider, self){
        
    }
}
