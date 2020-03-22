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
import SceneManager from "../../CocosFrame/SceneManager";
import { DramaData } from "../../CocosFrame/dts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DramaItem extends cc.Component {
    @property({type:[cc.Sprite]})
    icons:cc.Sprite[] = [];
    @property(cc.Label)
    label: cc.Label = null;
    data = null;

    onLoad(){
        this.node.on(ScrollList.SET_DATA, this.setData, this);
        this.node.on("click", this.onTap, this);
    }
    setData(data:DramaData){
        this.data = data;
        let cnt = 0;
        let urls = [];
        if(data.hero){
            urls.push(data.hero.url);
        }
        if(data.monsters){
            for(let i=0; i<data.monsters.length; i++){
                urls.push(data.monsters[i].url);
            }
        }
        this.label.node.active = (urls.length > this.icons.length);

        for(let i=0; i<this.icons.length-1; i++){
            let sprite = this.icons[i];
            if(i<urls.length){
                sprite.node.active = true;
                let url = urls[i];
                cc.loader.load(url, (err, texture)=>{
                    if(!err){
                        let spriteFrame = sprite.spriteFrame || new cc.SpriteFrame();
                        spriteFrame.setTexture(texture);
                        sprite.spriteFrame = spriteFrame;
                    }
                });
            }else{
                sprite.node.active = false;
            }
        }
    }
    onTap(){
        SceneManager.ins.OpenPanelByName("PaintGuidePanel");
    }
}
