// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import ScrollList from "../../CustomUI/ScrollList";
import { Util } from "../../CocosFrame/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankItem extends cc.Component {

    @property(cc.Label)
    rankLabel: cc.Label = null;
    @property(cc.Label)
    timeLabel: cc.Label = null;
    @property(cc.Node)
    selectBox: cc.Node = null;

    onLoad () {
        this.node.on(ScrollList.SET_DATA, this.setData, this);
        this.node.on(ScrollList.STATE_CHANGE, this.onStateChange, this);
    }

    setData (data) {
        this.rankLabel.string = "#"+data.rank;
        this.timeLabel.string =  Util.getTimeStr(data.time) + "秒";
    }
    onStateChange(select){
        this.selectBox.active = select;
    }
}
