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
import Virus from "./Virus";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Disinfection extends cc.Component {
    onCollisionEnter(other:cc.Collider, self){
        if(other.node.group == "Virus"){
            let virus = other.node.getComponent(Virus);
            if(virus && virus.active){
                virus.beginDrop();
            }
        }
    }
}
