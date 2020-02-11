import SceneManager from "../Frame/SceneManager";
import FarmScene from "./FarmScene";

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
export default class FightMenu extends cc.Component {

    @property(cc.Button)
    giveUpBtn: cc.Button = null;

    @property
    text: string = 'hello';

    onLoad () {
        this.giveUpBtn.node.on("click", this.onGiveUpBtnClick, this);
    }
    private onGiveUpBtnClick(){
        let farmScene = SceneManager.ins.findScene(FarmScene);
        farmScene.endFight();
    }
}
