// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { DB } from "../CocosFrame/DataBind";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("自定义UI/CircleProgress")
export default class CircleProgress extends DB.DataBindComponent {
    @property(cc.Sprite)
    progressIcon: cc.Sprite = null;
    @property(cc.Label)
    label: cc.Label = null;
    setProgress(progress:number){
        this.progressIcon.fillRange = progress;
        if(progress<0.2){
            this.progressIcon.node.color = cc.Color.RED;
        }else if(progress <0.5){
            this.progressIcon.node.color = cc.Color.YELLOW;
        }else{
            this.progressIcon.node.color = cc.Color.GREEN;
        }
        this.label.string = `${Math.floor(progress*100)}%`;
    }
}
