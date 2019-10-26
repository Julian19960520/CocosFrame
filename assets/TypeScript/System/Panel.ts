import PanelManager from "./PanelManager";

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
export default class Panel extends cc.Component {
    @property(cc.Button)
    public closeButton:cc.Button;
    @property(cc.Button)
    public okButton:cc.Button;
    @property(cc.Button)
    public cancelButton:cc.Button;
    onLoad(){
        this.closeButton.node.on("click", ()=>{
            this.closePanel();
        })
    }
    public closePanel(){
        PanelManager.ins.Close(this);
    }
}
