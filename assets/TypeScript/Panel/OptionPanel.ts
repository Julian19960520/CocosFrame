// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Panel from "../CocosFrame/Panel";
import Slider from "../CustomUI/Slider";
import { DB } from "../CocosFrame/DataBind";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/OptionPanel")
export default class OptionPanel extends Panel {

    @property(cc.Button)
    resetBtn: cc.Button = null;

    @property(cc.Button)
    saveBtn: cc.Button = null;

    @property(Slider)
    slider: Slider = null;

    onLoad () {
        super.onLoad();
        this.resetBtn.node.on("click", this.onResetBtnTap, this);
        this.saveBtn.node.on("click", this.onSaveBtnTap, this);
        this.slider.node.on(Slider.MOVE, this.onSliderMove, this);
    }
    onResetBtnTap(){

    }
    onSaveBtnTap(){
        this.panelStack.PopCurrent();
    }
    onSliderMove(progress){
        DB.Set("option/sensitivity", progress);
    }
}
