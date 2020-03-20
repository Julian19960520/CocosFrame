import { DB } from "../Frame/DataBind";
import { WeaponSlotData, WeaponType, WeaponData } from "../FarmScene/dts";
import { Config } from "../FarmScene/Config";
import { Util } from "../Frame/Util";
import SceneManager from "../Frame/SceneManager";
import MessageBox from "../Frame/MessageBox";
import Weapon from "./Weapon/Weapon";

const {ccclass, property} = cc._decorator;
export enum SlotState{
    prepare,    //准备状态
    gaming,     //游戏状态
}
@ccclass
export default class WeaponSlot extends DB.DataBindComponent {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Sprite)
    selectBox: cc.Sprite = null;
    @property(cc.Button)
    upgradeBtn: cc.Button = null;
    @property(cc.Label)
    lvlLabel: cc.Label = null;

    state:SlotState = SlotState.prepare;
    slotData:WeaponSlotData = null;
    weapon:Weapon = null;
    onLoad () {
        this.node.on("setData", this.setData, this);
        this.node.on("selectChange", this.selectChange, this);
        this.node.on("click", this.onClick, this);
        this.Bind("fight/skill", this.onSkillChange);
        this.upgradeBtn.node.on("click", this.onClickUpgradeBtn, this);
    }
    setData(data:WeaponSlotData){
        this.slotData = data;
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
    //如果武器槽锁住，则不能被选中
    canSelect(){
        return !this.slotData.lock;
    }
    //
    onClick(){
        if(this.state == SlotState.prepare){
            if(this.slotData.lock){
                this.onClickUnlock();
            }else{
                this.onClickToTakeDownWeapon();
            }
        }else if(this.state == SlotState.gaming){
            
        }
    }
    //当准备状态时点击锁住的武器槽，想要解锁时
    public onClickUnlock(){
        let coin = DB.Get("user/coin");
        let cost = this.slotData.cost;
        if(coin>= this.slotData.cost){
            SceneManager.ins.curScene.OpenPanelByName("MessageBox",(messageBox:MessageBox)=>{
                messageBox.label.string = `是否花费${this.slotData.cost}金币解锁武器槽`;
                messageBox.onOk = ()=>{
                    coin -= cost;
                    DB.Set("user/coin", coin);
                    this.slotData.lock = false;
                    this.setData(this.slotData);
                }
            });
        }
    }
    //当准备状态时点击武器槽，想要将武器撤下。
    public onClickToTakeDownWeapon(){
        this.node.dispatchEvent(Util.newCustomEvent("clickWeaponSlot", true, {
            item:this,
            data:this.slotData,
        }));
    }

    setWeapon(weapon:Weapon){
        this.weapon = weapon;
    }
    onSkillChange(skill){
        let showBtn = this.slotData && skill>0 && this.weapon && this.weapon.lvl < this.weapon.lvlMax-1;
        this.upgradeBtn.node.active = showBtn;
    }
    onClickUpgradeBtn(){
        let newLvl = this.weapon.lvl+1;
        this.weapon.setLvl(newLvl);
        if(newLvl < this.weapon.lvlMax-1){
            this.lvlLabel.string = `Lv.${newLvl}`;
        }else{
            this.lvlLabel.string = `Lv.Max`;
        }
        let skill = DB.Get("fight/skill");
        DB.Set("fight/skill", skill-1);
    }
    public setState(state:SlotState){
        this.state = state;
    }
}
