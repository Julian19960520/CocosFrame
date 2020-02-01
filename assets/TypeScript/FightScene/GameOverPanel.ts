import Panel from "../Frame/Panel";
import SceneManager, { ShiftAnima } from "../Frame/SceneManager";
import FightScene from "./FightScene";

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
export default class GameOverPanel extends Panel {
    @property(cc.Button)
    retryBtn:cc.Button = null;
    @property(cc.Button)
    backFarmBtn:cc.Button = null;
    onLoad(){
        this.retryBtn.node.on("click", this.onRetryBtnClick, this);
        this.backFarmBtn.node.on("click", this.onBackFarmBtnClick, this);
    }
    onRetryBtnClick(){
        this.panelStack.PopCurrent();
        let fightScene = SceneManager.ins.findScene(FightScene);
        fightScene.restartGame();
    }
    onBackFarmBtnClick(){
        this.panelStack.PopCurrent();
        SceneManager.ins.Back(ShiftAnima.simpleShift);
    }
}
