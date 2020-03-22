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

const {ccclass, property} = cc._decorator;

@ccclass
export default class ColorBtn extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.SpriteFrame)
    alphaSpriteFrame: cc.SpriteFrame = null;
    @property(cc.Sprite)
    selectBox: cc.Sprite = null;

    onLoad() {
        this.node.on(ScrollList.SET_DATA, this.setData, this);
        this.node.on(ScrollList.STATE_CHANGE, this.stateChange, this);
    }
    setData(data){
        if(data.color.getA() === 0){
            this.sprite.node.color = cc.Color.WHITE;
            this.sprite.spriteFrame = this.alphaSpriteFrame;
        }else{
            this.sprite.node.color = data.color;
        }
        // this.selectBox.node.color = cc.color(255-c.r, 255-c.g, 255-c.b);
    }
    stateChange(select){
        this.selectBox.node.active = select;
    }
}
