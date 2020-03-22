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
import ScrollList from "../CustomUI/ScrollList";
import { RankData } from "../CocosFrame/dts";
import { Local } from "../CocosFrame/Local";
import SceneManager from "../CocosFrame/SceneManager";
import MessageBox from "../CocosFrame/MessageBox";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/RankPanel")
export default class RankPanel extends Panel {

    @property(cc.Button)
    clearBtn: cc.Button = null;

    @property(cc.Button)
    okBtn: cc.Button = null;

    @property(ScrollList)
    scrollList: ScrollList = null;
    
    onLoad () {
        super.onLoad();
        this.clearBtn.node.on("click", this.onClearBtnTap, this);
        this.okBtn.node.on("click", this.onOkBtnTap, this);
        let rankDatas:RankData[] = Local.Get("rankDatas") || [];
        this.scrollList.setDataArr(rankDatas);
        this.scrollList.selectItemByData(null);
    }
    onClearBtnTap(){
        SceneManager.ins.OpenPanelByName("MessageBox",(messageBox:MessageBox)=>{
            messageBox.label.string = "是否清空排行榜";
            messageBox.onOk = ()=>{
                Local.Set("rankDatas", []);
                this.scrollList.setDataArr([]);
                this.scrollList.selectItemByData(null);
            };
        })
    }
    onOkBtnTap(){
        this.panelStack.PopCurrent();
    }
}
