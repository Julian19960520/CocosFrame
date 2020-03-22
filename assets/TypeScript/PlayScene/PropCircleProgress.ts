// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import CircleProgress from "../CustomUI/CircleProgress";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PropCircleProgress extends CircleProgress {
    @property
    bindkey:string = "";
    onLoad(){
        this.Bind(this.bindkey, (time)=>{
            if(time == null){
                return;
            }
            let progress = time / 10;
            if(progress>0){
                this.node.active = true;
                this.setProgress(progress);
            }else{
                this.node.active = false;
            }
        });
    }
}
