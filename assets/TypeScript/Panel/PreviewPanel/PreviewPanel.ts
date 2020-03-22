// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Panel from "../../CocosFrame/Panel";
import { crossPlatform } from "../../CocosFrame/dts";
import Graphics from "../../CustomUI/Graphics";
import Monster from "../../PlayScene/Monster";
import ToggleGroup from "../../CustomUI/ToggleGroup";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/PreviewPanel")
export default class PreviewPanel extends Panel {

    @property(ToggleGroup)
    toggleGroup: ToggleGroup = null;

    @property(cc.Button)
    saveBtn: cc.Button = null;

    @property(Monster)
    monster: Monster = null;

    graphics: Graphics = null;

    onLoad(){
        super.onLoad();
        this.saveBtn.node.on("click", this.onSaveBtnTap, this);
        this.toggleGroup.node.on(ToggleGroup.TOGGLE_CHANGE, this.onToggleChange, this);
    }
    start(){
        this.onToggleChange(0);
    }
    setGraphics(graphics:Graphics){
        this.graphics = graphics;
        this.monster.setTexture(this.graphics.renderTexture);
    }
    onToggleChange(idx){
        this.monster.playAnima(`action${idx+1}`);
    }
    onSaveBtnTap(){
        crossPlatform.getOpenDataContext().postMessage({
            type:"hello"
        });
        let canvas = crossPlatform.createCanvas();
        let ctx = canvas.getContext('2d');
        let pixels = this.graphics.pixels;//读取renderTexture中的数据
        let w = this.graphics.width;
        let h = this.graphics.height;
        let rowBytes = w * 4;
        for (let row = 0; row < h; row++) {
            let imageData = ctx.createImageData(w, 1);
            let start = row *  w * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = pixels[start + i];
            }
            ctx.putImageData(imageData, 0, row);
        }
        let tempFilePath = canvas.toTempFilePathSync({})
        crossPlatform.shareAppMessage({
            imageUrl: tempFilePath
        })
        console.log(tempFilePath);
        cc.loader.load(tempFilePath, (err, texture)=>{
            let spriteFrame = new cc.SpriteFrame();
            spriteFrame.setTexture(texture);
            // this.sprite.spriteFrame = spriteFrame;
        });
    }
}
