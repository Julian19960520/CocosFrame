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
export default class EmojiItem extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Sprite)
    selectBox: cc.Sprite = null;

    onLoad () {
        this.node.on(ScrollList.SET_DATA, this.setData, this);
        this.node.on(ScrollList.STATE_CHANGE, this.stateChange, this);
    }
    setData(data){
        if(data && data.id!=null){
            Util.loadRes(`Atlas/Panda/emoji${data.id}`, cc.SpriteFrame).then((spriteFrame:cc.SpriteFrame)=>{
                this.icon.spriteFrame = spriteFrame;
            });
        }else{
            this.icon.spriteFrame = null;
        }
    }
    stateChange(select){
        this.selectBox.node.active = select;
    }
}
