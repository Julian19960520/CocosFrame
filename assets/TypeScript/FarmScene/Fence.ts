import Hper from "./Hper";
import Pig from "./Pig";

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
export default class Fence extends Hper {
    @property(cc.Label)
    hpLabel:cc.Label = null;
    onEnable(){
        this.node.on("onHpMaxChange", this.updateHpLabel, this);
        this.node.on("onHpChange", this.updateHpLabel, this);
        this.node.on("onKilled", this.onKilled, this);
    }
    private onKilled(){
        this.node.active = false;
    }
    private updateHpLabel(){
        this.hpLabel.string = `${this.Hp}/${this.HpMax}`
    }
}
