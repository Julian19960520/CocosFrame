import { DB } from "../Frame/DataBind";
import Top from "../Frame/Top";
import SceneManager from "../Frame/SceneManager";
import { Util } from "../Frame/Util";
import MessageBox from "../Frame/MessageBox";
import { Type, FieldData, ItemData } from "./dts";
import Plant from "./Plant";


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
export default class Field extends DB.DataBindComponent {

    @property(cc.Button)
    unlockBtn: cc.Button = null;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(cc.Button)
    public selectBox: cc.Button = null;

    private fieldData:FieldData = null;
    private nextCost = 0;
    private item:cc.Node = null;
    public pos:number[];
    onLoad(){
        this.unlockBtn.node.on("click",this.onUnlockBtnClick, this);
        this.selectBox.node.on("click",this.onSelectBoxClick, this);  
        this.selectBox.node.active = false;
    }

    public setFieldData(fieldData:FieldData){
        this.fieldData = fieldData;
        this.setItemData(this.fieldData.itemData);
    }
    public getFieldData(){
        return this.fieldData;
    }
    public setItemData(itemData:ItemData){
        if(this.fieldData){
            this.fieldData.itemData = itemData;
            if(!itemData || itemData.type != Type.Obstacle){
                this.toOpenState();
            }else{
                this.toLockState();
            }
            
            if(this.item){
                this.item.removeFromParent();
            }
            if(itemData){
                this.newItemNode(itemData).then((node:cc.Node)=>{
                    this.node.addChild(node);
                    this.item = node;
                });
            }
        }
    }
    private onUnlockBtnClick(){
        if(this.fieldData){
            let coin = DB.Get("user/coin");
            if(coin >= this.nextCost){
                SceneManager.ins.curScene.OpenPanelByName("MessageBox",(messageBox:MessageBox)=>{
                    messageBox.label.string = `是否花费${this.nextCost}金币解锁`;
                    messageBox.onOk = ()=>{
                        coin -= this.nextCost;
                        DB.Set("user/coin", coin);
                        this.fieldData.open = true;
                        this.toOpenState();
                        this.unlockBtn.node.active = false;
                        this.node.dispatchEvent(new cc.Event.EventCustom('onFieldUnlock', true));        
                    }
                });

            }else{
                Top.ins.showToast("金币不足");
            }
        }
    }
    private toLockState(){
        cc.loader.loadRes("Atlas/Farm/Field1", cc.SpriteFrame, (err, spriteFrame)=> {
            this.sprite.spriteFrame = spriteFrame;
        });
    }
    private toOpenState(){
        cc.loader.loadRes("Atlas/Farm/Field2", cc.SpriteFrame, (err, spriteFrame)=> {
            this.sprite.spriteFrame = spriteFrame;
        });
    }
    
    public showUnlockBtn(b, nextCost){
        this.nextCost = nextCost;
        this.unlockBtn.node.active = b;
        this.unlockBtn.getComponentInChildren(cc.Label).string = nextCost;
    }
    
    //选择框动画
    private selectBoxTween:cc.Tween = null;
    public playSelectBoxAnim(){
        if(this.selectBoxTween){
            return;
        }
        this.selectBox.node.active = true;
        this.selectBox.node.width = this.selectBox.node.height = 48;
        this.selectBoxTween = cc.tween(this.selectBox.node)
            .repeatForever(
                cc.tween()
                    .to(1, { width:45,height:45})
                    .to(1, { width:48,height:48})
            )
            .start();
    }
    public stopSelectBoxAnim(){
        if(this.selectBoxTween){
            this.selectBoxTween.stop();
            this.selectBoxTween = null;
            this.selectBox.node.active = false;
        }
    }
    public onSelectBoxClick(){
        this.node.dispatchEvent(Util.newCustomEvent("SelectBoxClick", true, this)); 
    }
    //创造不同物品的工厂
    public newItemNode(itemData){
        return new Promise((resolve, reject)=>{
            switch(itemData.type){
                case Type.Plant:{
                    Util.instantPrefab("Scene/FarmScene/Item/Plant").then((node:cc.Node)=>{
                        let plant = node.getComponent(Plant);
                        plant.setupPlant(itemData);
                        resolve(node);
                    });
                    break;
                }
                case Type.Obstacle:{
                    Util.instantPrefab("Scene/FarmScene/Item/Obstacle").then((node:cc.Node)=>{
                        let sprite = node.getComponent(cc.Sprite);
                        cc.loader.loadRes(`Atlas/Item/Obstacle${itemData.fk}`, cc.SpriteFrame, (err, spriteFrame)=>{
                            sprite.spriteFrame = spriteFrame;
                        });
                        sprite.spriteFrame
                        resolve(node);
                    });
                    break;
                }
                case Type.Warehouse:{
                    Util.instantPrefab("Scene/FarmScene/Item/Warehouse").then((node:cc.Node)=>{
                        resolve(node);
                    });
                    break;
                }
                case Type.Doghouse:{
                    Util.instantPrefab("Scene/FarmScene/Item/Doghouse").then((node:cc.Node)=>{
                        resolve(node);
                    });
                    break;
                }
                case Type.Sprinkler:{
                    Util.instantPrefab("Scene/FarmScene/Item/Sprinkler").then((node:cc.Node)=>{
                        resolve(node);
                    });
                    break;
                }
                case Type.Scarecrow:{
                    Util.instantPrefab("Scene/FarmScene/Item/Scarecrow").then((node:cc.Node)=>{
                        resolve(node);
                    });
                    break;
                }
                case Type.Shit:{
                    Util.instantPrefab("Scene/FarmScene/Item/Shit").then((node:cc.Node)=>{
                        resolve(node);
                    });
                    break;
                }
                case Type.Phonograph:{
                    Util.instantPrefab("Scene/FarmScene/Item/Phonograph").then((node:cc.Node)=>{
                        resolve(node);
                    });
                    break;
                }
            }
        });
    }
}
