
import { PoolManager } from "../Frame/PoolManager";
import { FightSystem } from "../Frame/FightSystem";
import Damager from "../Frame/Damager";
import Hper from "../Frame/Hper";
import { TweenUtil } from "../Frame/TweenUtil";
import { Util } from "../Frame/Util";
import SceneManager from "../Frame/SceneManager";
import FightScene from "./FightScene";
import { AudioManager } from "../Frame/AudioManager";
import { wx } from "../FarmScene/dts";

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
    @property(cc.Sprite)
    sprite:cc.Sprite = null;
    @property(cc.Vec2)
    velocity: cc.Vec2 = null;
    
    hper:Hper = null;
    damager:Damager = null;
    playing:boolean = true;
    repeling:boolean = false;
    onLoad(){
        this.hper = this.node.getComponent(Hper);
        this.damager = this.node.getComponent(Damager);
        this.updateHpLabel();
        this.node.on(FightSystem.Event.HpChange, this.updateHpLabel, this);
        this.node.on(FightSystem.Event.HpMaxChange, this.updateHpLabel, this);
        this.node.on(FightSystem.Event.Beaten, this.onBeaten, this);      //被子弹击中
        this.node.on(FightSystem.Event.Killed, this.onKilled, this);      //被子弹射死
        this.node.on(FightSystem.Event.BeatHper, this.onBeatHper, this);    //撞击到栅栏
    }
    private updateHpLabel(){
        this.hpLabel.string = `${this.hper.Hp}/${this.hper.HpMax}`
    }

    update (dt) {
        if(this.playing){
            if(!this.repeling){
                this.node.position = this.node.position.add(this.velocity.mul(dt));
            }else{
                this.node.position = this.node.position.sub(this.velocity.mul(dt));
            }
        }
    }
    public play(){
        this.playing = true;
    }
    public stop(){
        this.playing = false;
    }
    public init(){
        this.damager.remainTimes = 1;
        Util.enableAllCollider(this.node);
    }
    //战斗系统
    private onBeaten(){
        this.repeling = true;
        setTimeout(() => {
            this.repeling = false;
        }, 100);
        TweenUtil.applyScaleBounce(this.node, 1, 0.95);
        let scene = SceneManager.ins.findScene(FightScene);
        TweenUtil.applyShake(scene.node);
        AudioManager.playSound("hit0");
    }
    private onKilled(){
        TweenUtil.applyScaleBounce(this.node, 1, 0.95, null, ()=>{
            PoolManager.returnInstance(this.node);
        });
    }
    public onBeatHper() {
        Util.disableAllCollider(this.node);
        PoolManager.returnInstance(this.node);
    }
}
