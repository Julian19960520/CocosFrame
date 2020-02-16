import { DB } from "../Frame/DataBind";
import { WeaponSlotData, WeaponType, WeaponData } from "../FarmScene/dts";
import { Config } from "../FarmScene/Config";
import { Util } from "../Frame/Util";

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
export default class WeaponSlot extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Sprite)
    selectBox: cc.Sprite = null;
    
    data:WeaponSlotData = null;
    onLoad () {
        this.node.on("setData", this.setData, this);
        this.node.on("selectChange", this.selectChange, this);
        this.node.on("click", this.onClick, this);
    }
    setData(data:WeaponSlotData){
        this.data = data;
        if(data.lock){
            cc.loader.loadRes("Atlas/Fight/lock", cc.SpriteFrame, (err, spriteFrame)=>{
                this.icon.spriteFrame = spriteFrame;
            });
        }else{
            if(data.type == WeaponType.Default){
                cc.loader.loadRes("Atlas/Fight/plus",cc.SpriteFrame,  (err, spriteFrame)=>{
                    this.icon.spriteFrame = spriteFrame;
                });
            }else{
                let weaponConf = Config.WeaponConfByType(data.type);
                cc.loader.loadRes(weaponConf.iconUrl, cc.SpriteFrame, (err, spriteFrame)=>{
                    this.icon.spriteFrame = spriteFrame;
                });
            }
        }
    }
    selectChange(b){
        this.selectBox.node.active = b;
    }
    onClick(){
        this.node.dispatchEvent(Util.newCustomEvent("clickWeaponSlot", true, {
            item:this,
            data:this.data,
        }));
    }
}
