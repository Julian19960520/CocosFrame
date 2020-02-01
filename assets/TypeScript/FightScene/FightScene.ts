import Scene from "../Frame/Scene";
import Rabbit from "../FarmScene/Rabbit";
import PigFactory from "../FarmScene/PigFactory";
import { Util } from "../Frame/Util";
import GameOverPanel from "./GameOverPanel";

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

    private targetX:number = 0;

    onLoad () {
        this.node.on("GameOver", this.onGameOver, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.playReadyGoAnim(()=>{
            this.restartGame();
        });
    }
    private onTouchMove(evt :cc.Event.EventTouch){
        let delta = evt.getDelta();
        this.targetX += delta.x;
    }

    public update (dt) {
        this.rabbit.node.x = Util.lerp(this.rabbit.node.x, this.targetX, 0.1*dt*this.lerpSpeed);
    }
    private playReadyGoAnim(callback){
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
