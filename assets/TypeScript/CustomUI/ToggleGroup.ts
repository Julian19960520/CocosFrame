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
@menu("自定义UI/ToggleGroup")
export default class ToggleGroup extends cc.ToggleContainer {
    public static TOGGLE_CHANGE:"TOGGLE_CHANGE";
    public idx=0;
    onLoad(){
        let evtHandler = new cc.Component.EventHandler();
        evtHandler.target = this.node;
        evtHandler.handler = "_stateChange"
        evtHandler.component = "ToggleGroup";
        this.checkEvents.push(evtHandler);
    }
    _stateChange(toggle){
        this.idx = this.toggleItems.indexOf(toggle);
        this.node.emit(ToggleGroup.TOGGLE_CHANGE, this.idx);
    }
}
