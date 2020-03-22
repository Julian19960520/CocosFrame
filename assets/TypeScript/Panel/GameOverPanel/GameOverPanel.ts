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
import ScrollList from "../../CustomUI/ScrollList";
import SceneManager from "../../CocosFrame/SceneManager";
import PlayScene from "../../PlayScene/PlayScene";
import { DB } from "../../CocosFrame/DataBind";
import { Local } from "../../CocosFrame/Local";
import { RankData } from "../../CocosFrame/dts";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/GameOverPanel")
export default class GameOverPanel extends Panel {

    @property(ScrollList)
    scrollList: ScrollList = null;

    @property(cc.Button)
    homeBtn: cc.Button = null;

    @property(cc.Button)
    retryBtn: cc.Button = null;


    onLoad(){
        super.onLoad();
        this.homeBtn.node.on("click", this.onHomeBtnTap, this);
        this.retryBtn.node.on("click", this.onRetryBtnTap, this);
    }
    setData(data){
        let newData = {
            rank:1,
            time:data.time
        }
        cc.log(data);
        let rankDatas:RankData[] = Local.Get("rankDatas") || [];
        for(let i=0; i<rankDatas.length; i++){
            let p = rankDatas[i];
            if(p.time < newData.time){
                newData.rank = p.rank+1;
            }else{
                p.rank++;
            }
        }
        rankDatas.splice(newData.rank-1, 0, newData);
        Local.Set("rankDatas", rankDatas);
        this.scrollList.setDataArr(rankDatas);
        this.scrollList.selectItemByData(newData);
    }
    onHomeBtnTap(){
        let  playScene = SceneManager.ins.findScene(PlayScene);
        if(playScene){
            playScene.savelyExit();
        }
    }
    onRetryBtnTap(){
        this.panelStack.PopCurrent();
        let  playScene = SceneManager.ins.findScene(PlayScene);
        if(playScene){
            playScene.restart();
        }
    }
}
