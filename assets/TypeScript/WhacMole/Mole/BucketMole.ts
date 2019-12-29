import MoleBase from "./MoleBase";
import ParticleSystem from "../../Frame/ParticleSystem";
import { DB } from "../../Frame/DataBind";
import { PoolManager } from "../../Frame/PoolManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BucketMole extends MoleBase {
    private knocked = false;
    private timer = 0;
    private knocking = false;
    onEnable () {
        super.onLoad();
        this.view.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.view.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.view.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        
    }
    onDisable(){
        this.view.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.view.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.view.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    public Reset(){
        this.view.resumeSystemEvents(true);
    }
    public onBeatStart(){
        this.view.resumeSystemEvents(true);
        this.animation.play("Show");
        this.knocked = false;
        this.knocking = false;
        this.timer = 0;
    }
    public onBeatEnd(callback){
        this.view.pauseSystemEvents(true);
        this.animation.play("Hide");
        if(!this.knocked){
            DB.Set("MissBeat",{})
        }
        let onStop = ()=>{
            this.animation.off('stop', onStop);
            callback();
        }
        this.animation.on('stop', onStop);
    }

    update(dt){
        if(!this.knocking){
            return;
        }
        this.timer += dt;
        if(this.timer > 0.1){
            this.timer = 0;
            let knockStarNode = PoolManager.getInstance("Scene/WhacMoleScene/KnockStar");
            this.node.addChild(knockStarNode);
            knockStarNode.y = 60;
            let particleSystem = knockStarNode.getComponent(ParticleSystem);
            particleSystem.play();

            this.animation.play("Beaten");
            DB.Set("TapBeat",{score:1})
        }
    }
    private onTouchStart(){
        this.knocking = true;
    }
    private onTouchEnd(){
        this.knocking = false;
    }
}