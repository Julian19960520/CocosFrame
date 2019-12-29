import MoleBase from "./MoleBase";
import ParticleSystem from "../../Frame/ParticleSystem";
import { DB } from "../../Frame/DataBind";
import { PoolManager } from "../../Frame/PoolManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NormalMole extends MoleBase {
    private knocked = false;
    onEnable () {
        super.onLoad();
        this.view.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
    }
    onDisable(){
        this.view.off(cc.Node.EventType.TOUCH_START, this.onTouch, this);
    }
    public Reset(){
        this.view.resumeSystemEvents(true);
    }
    public onBeatStart(){
        this.view.resumeSystemEvents(true);
        this.animation.play("Show");
        this.knocked = false;
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
    private onTouch(){
        let knockStarNode = PoolManager.getInstance("Scene/WhacMoleScene/KnockStar");
        this.node.addChild(knockStarNode);
        knockStarNode.y = 60;
        let particleSystem = knockStarNode.getComponent(ParticleSystem);
        particleSystem.play();

        this.animation.play("Beaten");
        DB.Set("TapBeat",{score:1})
        this.view.pauseSystemEvents(true);
        this.knocked = true;
    }
}