import Panel from "../Frame/Panel";

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
export default class MessageBox extends Panel {
    @property(cc.Label)
    public label:cc.Label = null;
    @property(cc.Button)
    public okBtn:cc.Button = null;
    @property(cc.Button)
    public cancelBtn:cc.Button = null;

    public onOk = null;
    public onCancel = null;

    onLoad(){
        super.onLoad();
        cc.log("autoClosePrePanel", this.autoClosePrePanel);
        this.okBtn.node.on("click", this.onOkBtnClick, this);
        this.cancelBtn.node.on("click", this.onCancelBtnClick, this);
    }
    onDestroy(){
        super.onDestroy();
        this.onOk = null;
        this.onCancel = null;
        this.okBtn.node.off("click", this.onOkBtnClick, this);
        this.cancelBtn.node.off("click", this.onCancelBtnClick, this);
    }
    private onOkBtnClick(){
        if(this.onOk){
            this.onOk();
        }
        this.panelStack.PopCurrent();
    }
    private onCancelBtnClick(){
        if(this.onCancel){
            this.onCancel();
        }
        this.panelStack.PopCurrent();
    }
    
}
