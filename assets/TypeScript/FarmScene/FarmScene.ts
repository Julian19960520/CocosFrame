import Scene from "../Frame/Scene";
import { Util } from "../Frame/Util";
import { DB } from "../Frame/DataBind";
import Field from "./Field";
import Menu from "./Menu";
import { TweenUtil } from "../Frame/TweenUtil";
import { PlantItemData, FieldData, ItemData, PropItemData } from "./dts";
import SceneManager, { ShiftAnima } from "../Frame/SceneManager";
import PlaceTipBox from "./PlaceTipBox";
import PigFactory from "./PigFactory";
import { PoolManager } from "../Frame/PoolManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class FarmScene extends Scene {


    @property(cc.ScrollView)
    sceneScrollview: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;
    
    @property(cc.Node)
    fieldGroup: cc.Node = null;

    @property(cc.Node)
    fieldPrefab: cc.Node = null;

    @property(cc.Button)
    guidepostBtn: cc.Button = null;

    @property(Menu)
    menu: Menu = null;

    @property(PlaceTipBox)
    public placeTipBox:PlaceTipBox = null;

    private row = 0;
    private col = 0;
    private fieldGrid:Field[][] = [];
    private fieldDataGrid:FieldData[][] = [];
    public onLoad () {
        this.initField();
        this.node.on("SelectBoxClick", this.onSelectBoxClick, this);
        this.node.on("GameOver", this.onGameOver, this);
        this.guidepostBtn.node.on("click", this.onGuidepostBtnClick, this);
        cc.director.on("SowPlant",this.onSowPlant,this);
        cc.director.on("PlaceProp",this.onPlaceProp,this);
        cc.director.on("RemoveItemData",this.onRemoveItemData,this);
    }

    //当播种种子时
    private onSowPlant(itemData){
        let pos = itemData.pos;
        let iRow = pos[0]+pos[2]-1;
        let iCol = pos[1]+pos[3]-1;
        let field = this.fieldGrid[iRow][iCol];
        field.setItemData(itemData);
    }
    //当放置道具时
    private onPlaceProp(propItemData:PropItemData){
        let pos = propItemData.pos;
        let iRow = pos[0]+pos[2]-1;
        let iCol = pos[1]+pos[3]-1;
        let field = this.fieldGrid[iRow][iCol];
        field.setItemData(propItemData);
    }
    private onRemoveItemData(itemData:ItemData){
        let pos = itemData.pos;
        let iRow = pos[0]+pos[2]-1;
        let iCol = pos[1]+pos[3]-1;
        let field = this.fieldGrid[iRow][iCol];
        field.setItemData(null);
    }
    //初始化田地块
    public initField(){
        let fieldDataGrid:any[][] = DB.Get("user/fieldDataGrid");
        this.fieldDataGrid = fieldDataGrid;
        this.row = fieldDataGrid.length;
        this.col = fieldDataGrid[0].length;
        this.fieldGroup.width = this.col * this.fieldPrefab.width;
        this.fieldGroup.height = this.row * this.fieldPrefab.height;
        for(let i=0; i<fieldDataGrid.length; i++){
            let arr = [];
            let fieldDataArr = fieldDataGrid[i];
            for(let j=0; j<fieldDataArr.length; j++){
                let node:cc.Node = cc.instantiate(this.fieldPrefab);
                this.fieldGroup.addChild(node);
                let fieldData = fieldDataArr[j];    
                let field = node.getComponent(Field);
                field.pos = [i,j,1,1];
                field.setFieldData(fieldData);
                arr.push(field);
            }
            this.fieldGrid.push(arr);
        }
        this.fieldPrefab.removeFromParent();
        this.fieldPrefab = null;
        this.updateUpgradeBtn();
    }

    //更新田地块上的升级按钮
    private updateUpgradeBtn(){
        let fieldDataGrid = this.fieldDataGrid;
        let cnt = 0;
        let list:Field[] = [];
        for(let i=0; i<fieldDataGrid.length; i++){
            let fieldDataArr = fieldDataGrid[i];
            for(let j=0; j<fieldDataArr.length; j++){
                let field = this.fieldGrid[i][j];
                let b = this.shouldShowUpgradeBtn(i, j);
                if(b){
                    list.push(this.fieldGrid[i][j]);
                }else{
                    this.fieldGrid[i][j].showUnlockBtn(false, 0);
                }
                if(this.fieldDataGrid[i][j].open){
                    cnt++;
                }
            }
        }
        let nextCost = 50;
        for(let i=0; i<list.length; i++){
            list[i].showUnlockBtn(true, nextCost);
        }
    }
    //判断田地块是否可解锁（与其他已解锁地块相邻即可解锁）
    private shouldShowUpgradeBtn(row, col){
        let up,down,left,right, center;
        let fieldDataGrid = this.fieldDataGrid;
        if(row>=0 && row<this.row && col>=0 && col<this.col){
            center = fieldDataGrid[row][col];
        }else{
            return false;
        }
        if(row-1>=0){
            up = fieldDataGrid[row-1][col];
        }
        if(row+1<this.row){
            down = fieldDataGrid[row+1][col];
        }
        if(col-1>=0){
            left = fieldDataGrid[row][col-1];
        }
        if(col+1<this.col){
            right = fieldDataGrid[row][col+1];
        }
        let b = (up && up.open) || (down && down.open) || (left && left.open) || (right && right.open);
        return b && !center.open;
    }
    //地块升级事件回调
    private onFieldUnlock(){
        this.updateUpgradeBtn();
    }

    public playHarvestPlantAnim(plantItemData:PlantItemData, callback){
        let pos = plantItemData.pos;
        let iRow = pos[0]+pos[2]-1;
        let iCol = pos[1]+pos[3]-1;
        let field = this.fieldGrid[iRow][iCol];
        field.stopSelectBoxAnim();
        let target = this.menu.wareHouseBtn.node;
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        cc.log(plantItemData);
        cc.loader.loadRes(`Atlas/Icon/FlyPlant/${plantItemData.fk}`,cc.SpriteFrame,(err, spriteFrame:any)=>{
            sprite.spriteFrame = spriteFrame;
        });
        this.node.addChild(node);
        let temp = field.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        temp = this.node.convertToNodeSpaceAR(temp);
        node.position = cc.v2(temp.x, temp.y);
        node.anchorY = 0;
        temp = target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        temp = this.node.convertToNodeSpaceAR(temp);
        cc.tween(node)
            .to(0.5, {position: cc.v2(node.position.x, node.position.y+20)})
            .to(0.5, {position: temp}, { easing: 'cubicIn'}).call(()=>{
            node.removeFromParent();
            TweenUtil.applyScaleBounce(target,1, 1.2);
            callback();
        }).start();
    }

    public onGuidepostBtnClick(){
        SceneManager.ins.Enter("TownScene", ShiftAnima.moveRightShift);
    }


    //
    private onSelectCallback = null;
    public beginSelectField(selectFunc, callback){
        this.clearSelectField();
        this.onSelectCallback = callback;
        //黄框动画
        let posArr = [];
        let fieldDataGrid:any[][] = DB.Get("user/fieldDataGrid");
        for(let i=0; i<fieldDataGrid.length; i++){
            let fieldDataArr = fieldDataGrid[i];
            for(let j=0; j<fieldDataArr.length; j++){
                let fieldData = fieldDataArr[j];
                if(selectFunc(fieldData, i, j)){
                    posArr.push([i, j, 1, 1]);
                }
            }
        }
        if(posArr.length > 0){
            //存在空位
            for(let i=0;i<posArr.length;i++){
                let pos = posArr[i];
                let iRow = pos[0]+pos[2]-1;
                let iCol = pos[1]+pos[3]-1;
                let field = this.fieldGrid[iRow][iCol];
                field.playSelectBoxAnim();
            }
        }
        return posArr.length > 0;
    }
    public clearSelectField(){
        this.onSelectCallback = null;
        //关闭黄框动画
        let fieldGrid = this.fieldGrid;
        for(let i=0; i<fieldGrid.length; i++){
            let fieldArr = fieldGrid[i];
            for(let j=0; j<fieldArr.length; j++){
                fieldArr[j].stopSelectBoxAnim();
            }
        }
    }
    private onSelectBoxClick(evt:cc.Event.EventCustom){
        let field:Field = evt.detail;
        if(this.onSelectCallback){
            this.onSelectCallback(field);
        }
    }
    public beginFight(){
        cc.tween(this.content).to(0.5, {position: cc.v2(0, -600)}, { easing: 'quintOut'}).call(()=>{

        }).start();
    }
    public endFight(){
        cc.tween(this.content).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
            
        }).start();
    }
    public onGameOver(){

    }
}
