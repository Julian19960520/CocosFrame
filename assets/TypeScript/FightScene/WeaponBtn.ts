import { Config } from "../FarmScene/Config";
import { DB } from "../Frame/DataBind";
import { WeaponSlotData } from "../FarmScene/dts";
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
export default class WeaponBtn extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    inUseNode: cc.Node = null;

    data:any = null;
    onLoad () {
        this.node.on("setData", this.setData, this);
        this.node.on("click", this.onClick, this);
    }
    setData(data){
        this.data = data;
        let weaponConf = Config.WeaponConfByType(data.type);
        cc.loader.loadRes(weaponConf.iconUrl, cc.SpriteFrame, (err, spriteFrame)=>{
            this.icon.spriteFrame = spriteFrame;
        });
        this.inUseNode.active = this.isInUse(data.type);
    }
    isInUse(type){
        let slots:WeaponSlotData[] = DB.Get("user/weaponSlots");
        for(let i=0;i<slots.length;i++){
            if(slots[i].type == type){
                return true;
            }
        }
        return false;
    }
    onClick(){
        this.node.dispatchEvent(Util.newCustomEvent("clickWeaponBtn", true, {
            item:this,
            data:this.data,
        }));
    }
}
