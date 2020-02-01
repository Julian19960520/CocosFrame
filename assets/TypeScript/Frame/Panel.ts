import PanelStack from "./PanelStack";
import { DB } from "./DataBind";

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
export default class Panel extends DB.DataBindComponent {
    @property(cc.Button)
    public closeBtn:cc.Button = null;
    @property
    public autoClosePrePanel = true;        //当打开此面板时，是否自动关闭前一个面板
    
    public panelStack:PanelStack = null;
    public onClose = null;

    onLoad(){
        this.closeBtn.node.on("click", this.onCloseBtnClick, this);
    }
    onDestroy(){
        this.onClose = null;
    }
    public close(callback = null){
        this.node.scale = 1;
        cc.tween(this.node).to(0.1,{scale:0}).hide().call(callback).start();
    }
    public open(callback = null){
        this.node.scale = 0;
        cc.tween(this.node).show().to(0.1,{scale:1}).call(callback).start();
    }
    private onCloseBtnClick(){
        if(this.onClose){
            this.onClose();
        }
        this.panelStack.PopCurrent();
    }
}
