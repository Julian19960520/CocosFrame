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

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/WikiPanel")
export default class WikiPanel extends Panel {

    @property(cc.Button)
    resetBtn: cc.Button = null;

    @property(cc.Button)
    saveBtn: cc.Button = null;

    onLoad () {
        super.onLoad();
        this.resetBtn.node.on("click", this.onResetBtnTap, this);
        this.saveBtn.node.on("click", this.onSaveBtnTap, this);
    }
    onResetBtnTap(){

    }
    onSaveBtnTap(){
        this.panelStack.PopCurrent();
    }
}
