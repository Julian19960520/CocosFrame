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
    public set Hp(value){
        if(value != this.hp){
            this.hp = value;
            if(this.hp<=0){
                this.hp = 0;
                this.node.emit("onKilled");
            }else if(this.hp>this.hpMax){
                this.hp = this.hpMax;
            }
            this.node.emit("onHpChange");
        } 
    }
    public get Hp(){
        return this.hp;
    }

    //最大血量
    @property
    private hpMax: number = 3;
    public set HpMax(value){
        if(value != this.hpMax){
            this.hpMax = value;
            if(this.hp>this.hpMax){
                this.hp = this.hpMax;
            }
            this.node.emit("onHpMaxChange");
        } 
    }
    public get HpMax(){
        return this.hpMax;
    }
}
