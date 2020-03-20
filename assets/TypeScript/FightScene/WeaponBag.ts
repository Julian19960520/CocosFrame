import ScrollList from "../Frame/ScrollList";
import { DB } from "../Frame/DataBind";
import { WeaponSlotData, WeaponType } from "../FarmScene/dts";
import WeaponSlot, { SlotState } from "./WeaponSlot";
import WeaponBtn from "./WeaponBtn";

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
export default class WeaponBag extends DB.DataBindComponent {
    @property(ScrollList)
    slotList:ScrollList = null;
    @property(ScrollList)
    allWeaponList:ScrollList = null;

    onLoad () {
        this.slotList.node.on("selectItem", this.onSelectItem, this);
        this.node.on("clickWeaponBtn", this.onClickWeaponBtn, this);
        this.node.on("clickWeaponSlot", this.onClickWeaponSlot, this);
        this.Bind("user/weaponSlots", (weaponSlotData:WeaponSlotData[])=>{
            this.slotList.setDataArr(weaponSlotData);
            this.slotList.selectItemByIdx(0);
        });
        this.Bind("user/allWeapons",(datas)=>{
            this.allWeaponList.setDataArr(datas);
        });
    }
    curSelectItem:WeaponSlot = null;
    curSelectData:WeaponSlotData = null;
    onSelectItem(node:cc.Node, data:WeaponSlotData){
        this.curSelectItem = node.getComponent(WeaponSlot);
        this.curSelectData = data;
    }
    onClickWeaponBtn(evt:CustomEvent){
        if(this.curSelectData && this.curSelectItem){
            this.curSelectData.type = evt.detail.data.type;
            this.curSelectItem.setData(this.curSelectData);
            this.allWeaponList.setDataArr(DB.Get("user/allWeapons"));
        }
    }
    onClickWeaponSlot(evt:CustomEvent){
        let slot:WeaponSlot = evt.detail.item;
        let data:WeaponSlotData = evt.detail.data;
        if(slot && data){
            data.type = WeaponType.Default;
            slot.setData(data);
            this.allWeaponList.setDataArr(DB.Get("user/allWeapons"));
        }
    }
    public setSlotState(state:SlotState){
        let slots = this.slotList.content.getComponentsInChildren(WeaponSlot);
        for(let i=0;i<slots.length; i++){
            slots[i].setState(state);
        }
    }
}

