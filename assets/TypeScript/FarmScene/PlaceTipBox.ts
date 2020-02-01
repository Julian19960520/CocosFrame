import Panel from "../Frame/Panel";
import { PropData } from "./dts";
import { Config } from "./Config";

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
export default class PlaceTipBox extends cc.Component{
    @property(cc.Label)
    public label:cc.Label = null;
    @property(cc.Sprite)
    public icon:cc.Sprite = null;
    @property(cc.Button)
    public closeBtn:cc.Button = null;

    public onClose = null;
    onLoad(){
        this.closeBtn.node.on("click", this.onCloseBtnClick, this);
    }
    onDestroy(){
        this.onClose = null;
        this.closeBtn.node.off("click", this.onCloseBtnClick, this);
    }
    private onCloseBtnClick(){
        if(this.onClose){
            this.onClose();
        }
    }
    public setView(data){
        this.label.string = data.text;
        cc.loader.loadRes(data.icon,cc.SpriteFrame, (err, spriteFrame)=>{
            this.icon.spriteFrame = spriteFrame;
        });
    }
}
