import Hper from "./Hper";
import ScreenRect from "../Frame/ScreenRect";
import { PoolManager } from "../Frame/PoolManager";
import Fence from "./Fence";
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
export default class Pig extends cc.Component {
    @property(cc.Label)
    hpLabel:cc.Label = null;
    @property(cc.Vec2)
    velocity: cc.Vec2 = null;
    
    hper:Hper = null;
    damager:Damager = null;
    playing:boolean = true;
    onLoad(){
        this.hper = this.node.getComponent(Hper);
        this.damager = this.node.getComponent(Damager);
        this.updateHpLabel();
        this.node.on("onHpMaxChange", this.updateHpLabel, this);
        this.node.on("onHpChange", this.updateHpLabel, this);
        this.node.on("onKilled", this.onKilled, this);
    }
    private updateHpLabel(){
        this.hpLabel.string = `${this.hper.Hp}/${this.hper.HpMax}`
    }
    private onKilled(){
        PoolManager.returnInstance(this.node);
    }
    update (dt) {
        if(this.playing){
            this.node.position = this.node.position.add(this.velocity.mul(dt));
        }
    }
    public play(){
        this.playing = true;
    }
    public stop(){
        this.playing = false;
    }
    public onCollisionEnter(other, self) {
        let otherNode:cc.Node = other.node;
        if(otherNode.group == "Fence" || otherNode.group == "FarmHper"){
            let hper = otherNode.getComponent(Hper);
            if(hper){
                this.damager.attack(hper);
                PoolManager.returnInstance(this.node);
            }
        }
    }
}
