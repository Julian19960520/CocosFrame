import { PoolManager } from "../Frame/PoolManager";
import Carrot from "./Carrot";
import { Util } from "../Frame/Util";

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
export default class Rabbit extends cc.Component {

    @property(cc.Node)
    carrotGroup: cc.Node = null;
    @property(cc.Node)
    muzzlePos: cc.Node = null;

    
    @property
    ROF: number = 2;

    private timer = 0;
    onLoad () {
        PoolManager.preload([
            "Scene/FarmScene/Carrot/Carrot"
        ]);
    }

    start () {

    }

    update (dt) {
        if(!this.playing){
            return;
        }
        this.timer += dt;
        if(this.timer > 1/this.ROF){
            this.timer = 0;
            let carrotNode = PoolManager.getInstance("Scene/FarmScene/Carrot/Carrot");
            this.carrotGroup.addChild(carrotNode);
            let pos = this.muzzlePos.convertToWorldSpaceAR(cc.Vec2.ZERO);
            pos = this.carrotGroup.convertToNodeSpaceAR(pos);
            carrotNode.position = cc.v2(pos.x, pos.y);
            let carrot = carrotNode.getComponent(Carrot);
            carrot.velocity = cc.v2(0, 400);
        }
    }
    private playing = false;
    public play(){
        this.playing = true;
    }
    public stop(){
        this.playing = false;
    }
    public onCollisionEnter(other, self) {
        let otherNode:cc.Node = other.node;
        if(otherNode.group == "Pig"){
            this.node.dispatchEvent(Util.newCustomEvent("GameOver", true, null));
        }
    }
}
