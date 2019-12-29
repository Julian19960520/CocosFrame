import Panel from "../System/Panel";

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
    @property(cc.Button)
    public okBtn:cc.Button = null;
    @property(cc.Button)
    public cancelBtn:cc.Button = null;
    onLoad(){
        super.onLoad();
        this.okBtn.node.on("click",()=>{
            this.panelStack.OpenByName("MessageBox",(panel:Panel)=>{

            });
        })
    }
}
