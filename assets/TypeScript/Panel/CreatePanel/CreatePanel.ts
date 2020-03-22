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
import { DB } from "../../CocosFrame/DataBind";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/CreatePanel")
export default class CreatePanel extends Panel {
    @property(ScrollList)
    scrollList:ScrollList = null;
    @property(cc.Button)
    createNewBtn: cc.Button = null;
    @property(cc.Node)
    emptyNode: cc.Node = null;
    
    onLoad(){
        super.onLoad();
        this.createNewBtn.node.on("click", this.onCreateNewBtnTap, this);
        this.Bind("user/dramas",(dramas:any[])=>{
            this.scrollList.setDataArr(dramas);
            this.emptyNode.active = (dramas.length == 0);
        });
    }

    onCreateNewBtnTap(){
        SceneManager.ins.OpenPanelByName("PaintGuidePanel",()=>{});
    }
}
