import { WeaponData, WeaponLvlConfig } from "../../FarmScene/dts";
import { Config } from "../../FarmScene/Config";
import { PoolManager } from "../../Frame/PoolManager";
import { Util } from "../../Frame/Util";
import Bullet from "../Bullet";

const {ccclass, property} = cc._decorator;


@ccclass
export default class Weapon extends cc.Component {

    protected playing = false;
    public play(){
        this.playing = true;
    }
    public stop(){
        this.playing = false;
    }
    bulletParent: cc.Node = null;
    lvl:number = 0;
    lvlMax:number = 0;
    setLvl(lvl:number){}
}
