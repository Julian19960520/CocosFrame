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

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("自定义UI/Slider")
export default class Slider extends cc.Slider {
    public static MOVE:"MOVE";
    @property
    step = 10;
    @property
    min=1;
    @property
    max=10;

    onLoad(){
        let evtHandler = new cc.Component.EventHandler();
        evtHandler.target = this.node;
        evtHandler.handler = "_onMove"
        evtHandler.component = "Slider";
        this.slideEvents.push(evtHandler);
        
    }
    _onMove(target:Slider){
        let value = Util.lerp(this.min, this.max, this.progress);
        this.node.emit(Slider.MOVE, value);
    }
    _updateProgress(touch:cc.Event.EventTouch){
        if (!this.handle) { return; }
        let node = this.node;
        var localTouchPos = node.convertToNodeSpaceAR(touch.getLocation());
        let offset = this["_offset"];
        let progress = 0;
        if (this.direction === 0) {
            progress = Util.clamp01((localTouchPos.x - offset.x + node.anchorX * node.width) / node.width);
        }
        else {
            progress = Util.clamp01((localTouchPos.y - offset.y + node.anchorY * node.height) / node.height);
        }
        if(this.step >= 2){
            let s = this.step - 1;
            progress = Math.round(progress*s)/s;
        }
        this.progress = progress;
    }
    _updateHandlePosition(){
        if (!this.handle) { return; }
        var handlelocalPos;
        if (this.direction === 0) {
            let width = this.node.width - this.handle.node.width;
            handlelocalPos = cc.v2(-width* this.node.anchorX + this.progress * width, 0);
        }
        else {
            let height = this.node.height - this.handle.node.height;
            handlelocalPos = cc.v2(0, -height * this.node.anchorY + this.progress * height);
        }
        var worldSpacePos:any = this.node.convertToWorldSpaceAR(handlelocalPos);
        worldSpacePos = this.handle.node.parent.convertToNodeSpaceAR(worldSpacePos);
        this.handle.node.position = worldSpacePos;
    }
}
