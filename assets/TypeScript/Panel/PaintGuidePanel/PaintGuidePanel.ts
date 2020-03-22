// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Panel from "../../CocosFrame/Panel";
import SceneManager from "../../CocosFrame/SceneManager";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/PaintGuidePanel")
export default class PaintGuidePanel extends Panel {

    @property(cc.Button)
    paintHeroBtn: cc.Button = null;

    @property(cc.Button)
    paintMonsterBtn: cc.Button = null;

    @property(cc.Button)
    playBtn: cc.Button = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
        this.paintHeroBtn.node.on("click", this.onPaintHeroBtnTap, this);
        this.paintMonsterBtn.node.on("click", this.onPaintMonsterBtnTap, this);
        this.playBtn.node.on("click", this.onPlayBtnTap, this);
    }
    onPaintHeroBtnTap(){
        SceneManager.ins.OpenPanelByName("PaintPanel");
    }
    onPaintMonsterBtnTap(){
        SceneManager.ins.OpenPanelByName("PaintPanel");
    }
    onPlayBtnTap(){

    }
}
