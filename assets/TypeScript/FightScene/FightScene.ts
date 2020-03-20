import Scene from "../Frame/Scene";
import { Util } from "../Frame/Util";
import GameOverPanel from "./GameOverPanel";
import Rabbit from "./Rabbit";
import { DB } from "../Frame/DataBind";
import { Config } from "../FarmScene/Config";
import Fence from "./Fence";
import FarmHper from "./FarmHper";
import { WeaponSlotData, WeaponData, WeaponType, Ease } from "../FarmScene/dts";
import { PoolManager } from "../Frame/PoolManager";
import PigFactory from "./PigFactory";
import WeaponBag from "./WeaponBag";
import WeaponSlot, { SlotState } from "./WeaponSlot";
import Weapon from "./Weapon/Weapon";

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
export default class FightScene extends Scene {

    @property
    lerpSpeed: number = 150;
    @property(Rabbit)
    rabbit:Rabbit = null;

    @property(cc.Label)
    readyLabel:cc.Label = null;

    @property(cc.Label)
    lvlLabel:cc.Label = null;

    @property(cc.Label)
    skillLabel:cc.Label = null;

    @property(cc.Button)
    fightBtn: cc.Button = null;

    @property(FarmHper)
    farmHper: FarmHper = null;

    @property(PigFactory)
    pigFactory:PigFactory = null;

    @property(cc.ProgressBar)
    expBar: cc.ProgressBar = null;

    @property(WeaponBag)
    weaponBag: WeaponBag = null;

    @property(cc.Node)
    uiGroup: cc.Node = null;

    private targetX:number = 320;
    private exp:number = 0;
    private lvl:number = 0;
    private expMaxArr:number[] = [2,3,4,5];
    private skill:number = 0;
    onLoad () {
        let manager = cc.director.getCollisionManager();
        // manager.enabledDebugDraw = true;
        manager.enabled = true;
        this.node.on("GameOver", this.onGameOver, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.fightBtn.node.on("click", this.onFightBtnClick, this);
        this.rabbit.node.x = this.targetX;
        PoolManager.preload(["Scene/FightScene/ExpBall/ExpBall"]);
        this.uiGroup.position = cc.Vec2.ZERO;
        this.Bind("fight/skill", this.onSkillChange);
    }
    onEnable(){
        this.resetGame();
        this.weaponBag.setSlotState(SlotState.prepare);
    }
    private onFightBtnClick(){
        this.fightBtn.node.active = false;
        this.moveDownUIGroup();
        this.resetGame();
        this.weaponBag.setSlotState(SlotState.gaming);
        this.playReadyGoAnim(()=>{
            this.restartGame();
        });
    }
    private onTouchMove(evt :cc.Event.EventTouch){
        let delta = evt.getDelta();
        this.targetX += delta.x;
        this.targetX = Util.clamp(this.targetX, -320, 320);
    }

    public update (dt) {
        this.rabbit.node.x = Util.lerp(this.rabbit.node.x, this.targetX, 0.1*dt*this.lerpSpeed);
    }
    public playReadyGoAnim(callback){
        cc.tween(this.readyLabel.node)
            .call(()=>{
                this.readyLabel.node.active = true;
                this.readyLabel.string = "Ready";
            })
            .to(0.3,{scale:1.3}).to(0.3,{scale:1})
            .delay(0.6)
            .call(()=>{
                this.readyLabel.string = "Go!";
            })
            .to(0.3,{scale:1.3}).to(0.3,{scale:1})
            .delay(0.3)
            .call(()=>{
                this.readyLabel.node.active = false;
                callback();
            })
            .start();
    }
    resetGame(){
        let wallLevel:number = DB.Get("user/wallLevel");
        let wallHp = Config.configWall[wallLevel].hpMax;
        let fences = this.getComponentsInChildren(Fence);
        for(let i=0;i<fences.length;i++){
            let fence = fences[i];
            fence.HpMax = fence.Hp = wallHp;
            fence.node.active = true;
        } 
        this.farmHper.HpMax = this.farmHper.Hp = 3;
        this.pigFactory.clear();
        DB.Set("fight/skill", this.skill);
        this.setLvl(0);
        this.setExp(0);
    }
    restartGame(){
        this.resetWeaponData();
        // this.rabbit.play();
        this.pigFactory.play();
    }
    private onGameOver(){
        this.rabbit.stop();
        this.pigFactory.stop();
        this.OpenPanelByName("GameOverPanel", (panel:GameOverPanel)=>{

        });
    }
    public resetWeaponData(){
        this.rabbit.clearWeapon();
        let slotDatas:WeaponSlotData[] = DB.Get("user/weaponSlots");
        for(let i=0;i<slotDatas.length; i++){
            let slotData = slotDatas[i];
            let weaponSlot = this.weaponBag.slotList.findItemByData(slotData).getComponent(WeaponSlot);
            if(slotData.type != WeaponType.Default){
                this.rabbit.createWeapon(slotData.type).then((weapon:Weapon)=>{
                    weaponSlot.setWeapon(weapon);
                });
            }else{
                weaponSlot.setWeapon(null);
            }
        }
    }
    public moveUpUIGroup(){
        this.uiGroup.position = cc.v2(0, -370);
        cc.tween(this.uiGroup)
            .to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'})
            .start();
    }
    public moveDownUIGroup(){
        this.uiGroup.position = cc.v2(0, 0);
        cc.tween(this.uiGroup)
            .to(0.5, {position: cc.v2(0, -370)}, { easing: 'quintOut'})
            .start();
    }
    public setExp(exp){
        this.exp = exp;
        let expMax = this.expMaxArr[this.lvl];
        this.expBar.progress = exp/expMax;
        this.expBar.getComponentInChildren(cc.Label).string = `${exp}/${expMax}`
    }
    public addExp(delta){
        let expMax = this.expMaxArr[this.lvl];
        let newExp = this.exp+delta;
        if(newExp>expMax){
            let lvlMax = this.addLvl(1);
            if(lvlMax){
                this.setExp(expMax);
            }else{
                this.setExp(newExp-expMax);
            }
        }else{
            this.setExp(newExp);
        }
    }
    public setLvl(lvl){
        this.lvl = lvl;
        this.expBar.progress = lvl;
    }
    public addLvl(delta){
        let newLvl = this.lvl + delta;
        if(newLvl<this.expMaxArr.length){
            this.setLvl(newLvl);
            let skill = DB.Get("fight/skill");
            DB.Set("fight/skill", skill+1);
            return false;
        }else{
            this.setLvl(this.expMaxArr.length-1);
            return true;
        }
    }
    public onSkillChange(skill){
        this.skillLabel.string = skill;
    }
    public dropExpBall(node:cc.Node){
        let ball = PoolManager.getInstance("Scene/FightScene/ExpBall/ExpBall");
        this.expBar.node.addChild(ball);
        let pnt = Util.convertPosition(node, this.expBar.node);
        ball.position = pnt;
        cc.tween(ball)
            .to(1,{position:cc.Vec2.ZERO}, { easing: Ease.quintOut})
            .call(()=>{
                this.addExp(1);
                ball.removeFromParent();
            }).start();
    }
}
