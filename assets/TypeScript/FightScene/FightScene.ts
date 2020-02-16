import Scene from "../Frame/Scene";
import PigFactory from "../FarmScene/PigFactory";
import { Util } from "../Frame/Util";
import GameOverPanel from "./GameOverPanel";
import Rabbit from "./Rabbit";
import { DB } from "../Frame/DataBind";
import { Config } from "../FarmScene/Config";
import Fence from "./Fence";
import FarmHper from "./FarmHper";

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
    @property(PigFactory)
    pigFactory:PigFactory = null;

    @property(cc.Label)
    readyLabel:cc.Label = null;

    @property(cc.Button)
    fightBtn: cc.Button = null;

    @property(FarmHper)
    farmHper: FarmHper = null;
    
    private targetX:number = 320;

    onLoad () {
        let manager = cc.director.getCollisionManager();
        // manager.enabledDebugDraw = true;
        manager.enabled = true;
        this.node.on("GameOver", this.onGameOver, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.fightBtn.node.on("click", this.onFightBtnClick, this);
        this.rabbit.node.x = this.targetX;
    }
    onEnable(){
        this.initGame();
    }
    private onFightBtnClick(){
        this.fightBtn.node.active = false;
        this.initGame();
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
    initGame(){
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
    }
    restartGame(){
        this.rabbit.play();
        this.pigFactory.play();
    }
    private onGameOver(){
        this.rabbit.stop();
        this.pigFactory.stop();
        this.OpenPanelByName("GameOverPanel", (panel:GameOverPanel)=>{

        });
    }
}
