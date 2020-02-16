import Scene from "../Frame/Scene";
import { Util } from "../Frame/Util";
import GameOverPanel from "./GameOverPanel";
import Rabbit from "./Rabbit";
import { DB } from "../Frame/DataBind";
import { Config } from "../FarmScene/Config";
import Fence from "./Fence";
import FarmHper from "./FarmHper";
import { WeaponSlotData, WeaponData, WeaponType, Ease } from "../FarmScene/dts";
import Weapon from "./Weapon";
import { PoolManager } from "../Frame/PoolManager";
import PigFactory from "./PigFactory";

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
    }
    onEnable(){
        this.resetGame();
    }
    private onFightBtnClick(){
        this.fightBtn.node.active = false;
        this.resetGame();
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
    private weaponDatas:WeaponData[] = [];
    public resetWeaponData(){
        this.weaponDatas = [];
        this.rabbit.clearWeapon();
        let slots:WeaponSlotData[] = DB.Get("user/weaponSlots");
        for(let i=0;i<slots.length; i++){
            let slot = slots[i];
            if(slot.type != WeaponType.Default){
                let weaponData:WeaponData = {
                    type:slot.type,
                    lvl:1,
                };
                this.rabbit.createWeapon(weaponData);
                this.weaponDatas.push(weaponData);
            }
        }
        // let weaponDatas:any[] = DB.Get("user/weaponDatas");
        // for(let i=0; i<weaponDatas.length; i++){
        //     let weaponData = weaponDatas[i];
        //     this.newWeaponNode(weaponData).then((weapon:Weapon)=>{
        //         weapon.bulletGroup = this.bulletGroup;
        //         this.weapons.push(weapon);
        //         this.weaponGroup.addChild(weapon.node);
        //     });
        // }
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
            this.changeSkill(this.skill+1);
            return false;
        }else{
            this.setLvl(this.expMaxArr.length-1);
            return true;
        }
    }
    public changeSkill(delat){
        this.skill += delat;
        this.skillLabel.string = this.skill.toString();
    }
    public dropExpBall(node:cc.Node){
        let ball = PoolManager.getInstance("Scene/FightScene/ExpBall/ExpBall");
        this.expBar.node.addChild(ball);
        let pnt = Util.convertPosition(node, this.expBar.node);
        ball.position = pnt;
        cc.tween(ball)
            .to(1,{position:cc.Vec2.ZERO}, { easing: Ease.quintIn})
            .call(()=>{
                this.addExp(1);
                ball.removeFromParent();
            }).start();
    }
}
