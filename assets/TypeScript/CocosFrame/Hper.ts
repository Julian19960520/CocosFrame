import { FightSystem } from "./FightSystem";

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
export default class Hper extends cc.Component {
    //血量
    @property
    private hp: number = 3;
    public get Hp(){
        return this.hp;
    }
    public set Hp(hp){
        this.hp = hp;
        this.node.emit(FightSystem.Event.HpChange);
    }
    //最大血量
    @property
    private hpMax: number = 3;
    public get HpMax(){
        return this.hpMax;
    }
    public set HpMax(hpMax){
        this.hpMax = hpMax;
        this.node.emit(FightSystem.Event.HpMaxChange);
    }
}
