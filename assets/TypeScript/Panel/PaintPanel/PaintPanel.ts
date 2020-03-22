import Panel from "../../CocosFrame/Panel";
import Graphics from "../../CustomUI/Graphics";
import ScrollList from "../../CustomUI/ScrollList";
import Slider from "../../CustomUI/Slider";
import { Local } from "../../CocosFrame/Local";
import { crossPlatform } from "../../CocosFrame/dts";
import { Util } from "../../CocosFrame/Util";
import SceneManager from "../../CocosFrame/SceneManager";
import MessageBox from "../../CocosFrame/MessageBox";
import PreviewPanel from "../PreviewPanel/PreviewPanel";
import ToggleGroup from "../../CustomUI/ToggleGroup";
import Monster from "../../PlayScene/Monster";


const {ccclass, menu, property} = cc._decorator;

enum State{
    Pencil,
    Eraser,
    Bucket,
}
@ccclass
@menu("面板/PaintPanel")
export default class PaintPanel extends Panel {

    @property(ScrollList)
    colorList:ScrollList = null;

    //绘画
    @property(cc.Button)
    pencilBtn:cc.Button = null;
    @property(cc.Button)
    eraserBtn:cc.Button = null;
    @property(cc.Button)
    revertBtn:cc.Button = null;
    @property(cc.Button)
    clearBtn:cc.Button = null;
    @property(cc.Button)
    bucketBtn:cc.Button = null;
    @property(cc.Button)
    saveBtn:cc.Button = null;
    @property(Graphics)
    graphics:Graphics = null;
    @property(Slider)
    sizeSlider:Slider = null;
    //动画
    @property(ToggleGroup)
    actionToggle:ToggleGroup = null;
    @property(Monster)
    monster: Monster = null;

    //
    @property(ToggleGroup)
    mainToggle:ToggleGroup = null;
    @property(cc.Node)
    paintGroup:cc.Node = null;
    @property(cc.Node)
    animGroup:cc.Node = null;


    state:State = State.Pencil;

    onLoad () {
        super.onLoad();
        this.graphics.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.pencilBtn.node.on("click", this.onPencilTap, this);
        this.eraserBtn.node.on("click", this.onEraserTap, this);
        this.revertBtn.node.on("click", this.onRevertTap, this);
        this.clearBtn.node.on("click", this.onClearTap, this);
        this.bucketBtn.node.on("click", this.onBucketTap, this);
        this.saveBtn.node.on("click", this.onSaveBtnTap, this);
        this.sizeSlider.node.on(Slider.MOVE, this.onSizeChange, this);

        this.actionToggle.node.on(ToggleGroup.TOGGLE_CHANGE, this.onActionToggleChange, this);
        this.mainToggle.node.on(ToggleGroup.TOGGLE_CHANGE, this.onMainToggleChange, this);
        this.initColorBtns();
        this.onPencilTap();
    }
    onDestroy(){
        super.onDestroy();
        this.graphics.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.graphics.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.graphics.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.pencilBtn.node.off("click", this.onPencilTap, this);
        this.eraserBtn.node.off("click", this.onEraserTap, this);
        this.revertBtn.node.off("click", this.onRevertTap, this);
        this.clearBtn.node.off("click", this.onClearTap, this);
        this.bucketBtn.node.off("click", this.onBucketTap, this);
        this.saveBtn.node.off("click", this.onSaveBtnTap, this);
        this.sizeSlider.node.off(Slider.MOVE, this.onSizeChange, this);
        this.colorList.node.off(ScrollList.SELECT_CHILD, this.selectColorChild, this)
    }
    initColorBtns(){
        let colors = [
            {color:cc.Color.WHITE},
            {color:cc.Color.BLACK},
            {color:cc.Color.GRAY},
            {color:cc.Color.RED},
            {color:cc.Color.GREEN},
            {color:cc.Color.BLUE},
            {color:cc.Color.YELLOW},
            {color:cc.Color.ORANGE},
            {color:cc.Color.CYAN},
            {color:cc.Color.MAGENTA},
            {color:cc.Color.TRANSPARENT},
         ];
         this.colorList.node.on(ScrollList.SELECT_CHILD, this.selectColorChild, this)
         this.colorList.setDataArr(colors);
         this.colorList.selectItemByData(colors[1]);
    }
    onMainToggleChange(idx){
        this.paintGroup.active = idx==0;
        this.animGroup.active = idx==1;
        if(idx == 1){
            this.monster.setTexture(this.graphics.renderTexture);
            this.onActionToggleChange(this.actionToggle.idx);
        }
    }
    onActionToggleChange(idx){
        this.monster.playAnima(`action${idx+1}`);
    }

    selectColorChild(item, data){
        this.pencilColor = data.color;
    }
    onPencilTap(){
        this.highLightBtn(this.pencilBtn);
        this.state = State.Pencil;
    }
    onEraserTap(){
        this.highLightBtn(this.eraserBtn);
        this.state = State.Eraser;
    }
    onBucketTap(){
        this.highLightBtn(this.bucketBtn);
        this.state = State.Bucket;
    }
    onRevertTap(){
        this.graphics.revert();
    }
    onClearTap(){
        SceneManager.ins.OpenPanelByName("MessageBox",(messageBox:MessageBox)=>{
            messageBox.label.string = "是否清空画布？";
            messageBox.onOk = ()=>{
                this.graphics.clear();
            }
        });
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
    highLightBtn(targetBtn:cc.Button){
        let btns = [this.pencilBtn, this.eraserBtn, this.bucketBtn];
        for(let i=0; i<btns.length; i++){
            let btn = btns[i];
            let node = btn.getComponentInChildren(cc.Sprite).node;
            if(btn == targetBtn){
                node.color = cc.color(116, 255, 255);
            }else{
                node.color = cc.Color.WHITE;
            }
        }
    }
    onSizeChange(size){
        this.graphics.lineWidth = size;
    }
    private pencilColor:cc.Color = null;

    private onTouchStart(event:cc.Event.EventTouch){
        let pos = event.getLocation();
        this.graphics.node.convertToNodeSpaceAR(pos, pos);
        switch(this.state){
            case State.Bucket:{
                this.graphics.bucketFill(pos, this.pencilColor);
                break;
            }
            case State.Pencil:
            case State.Eraser:{
                let color = (this.state == State.Pencil ? this.pencilColor : cc.Color.TRANSPARENT);
                this.graphics.color = color;
                this.graphics.beginLine(pos);     
                break;
            } 
        }
    }
    private onTouchMove(event:cc.Event.EventTouch){
        
        switch(this.state){
            case State.Bucket:{

                break;
            }
            case State.Pencil:
            case State.Eraser:{
                let pos = event.getLocation();
                this.graphics.node.convertToNodeSpaceAR(pos, pos);
                this.graphics.lineTo(pos);     
                break;
            } 
        }
    }
    private onTouchEnd(event:cc.Event.EventTouch){
        switch(this.state){
            case State.Bucket:{

                break;
            }
            case State.Pencil:
            case State.Eraser:{
                this.graphics.endLine();   
                break;
            } 
        }
    } 
}