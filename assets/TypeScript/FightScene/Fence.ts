
import { FightSystem } from "../Frame/FightSystem";
import Hper from "../Frame/Hper";

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
    onLoad(){
        this.node.on(FightSystem.Event.HpChange, this.updateHpLabel, this);
        this.node.on(FightSystem.Event.HpMaxChange, this.updateHpLabel, this);
        this.node.on(FightSystem.Event.Killed, this.onKilled, this);
    }
    private onKilled(){
        this.node.active = false;
    }
    private updateHpLabel(){
        this.hpLabel.string = `${this.Hp}/${this.HpMax}`
    }
}
