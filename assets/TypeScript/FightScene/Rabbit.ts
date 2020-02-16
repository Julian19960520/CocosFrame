import { PoolManager } from "../Frame/PoolManager";
import Carrot from "./Carrot";
import { Util } from "../Frame/Util";
import { DB } from "../Frame/DataBind";
import Weapon from "./Weapon";
import { WeaponType, WeaponData } from "../FarmScene/dts";
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
export default class Rabbit extends cc.Component {
    @property(cc.Node)
    weaponGroup:cc.Node = null;
    @property(cc.Node)
    bulletGroup:cc.Node = null;
    weapons:Weapon[] = [];
    exp:number = 0;
    onLoad(){

    }
    reset(){
        this.exp = 0;
        this.clearWeapon();
    }
    play(){
        for(let i=0;i<this.weapons.length;i++){
            this.weapons[i].play();
        }
    }
    stop(){
        for(let i=0;i<this.weapons.length;i++){
            this.weapons[i].stop();
        }
    }
    public clearWeapon(){
        this.weaponGroup.removeAllChildren();
    }
    public createWeapon(weaponData:WeaponData){
        this.newWeaponNode(weaponData).then((weapon:Weapon)=>{
            weapon.bulletGroup = this.bulletGroup;
            this.weapons.push(weapon);
            this.weaponGroup.addChild(weapon.node);
        });
    }
    //创造不同物品的工厂
    public newWeaponNode(weaponData){
        return new Promise((resolve, reject)=>{
            switch(weaponData.type){
                case WeaponType.Carrot:{
                    Util.instantPrefab("Scene/FightScene/Weapon/WeaponCarrot").then((node:cc.Node)=>{
                        let weapon = node.getComponent(Weapon);
                        weapon.play();
                        weapon.setData(weaponData);
                        resolve(weapon);
                    });
                    break;
                }
            }
        });
    }
}
