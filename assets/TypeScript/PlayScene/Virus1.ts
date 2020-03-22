
import { Util } from "../CocosFrame/Util";
import Virus from "./Virus";
import SceneManager from "../CocosFrame/SceneManager";
import PlayScene from "./PlayScene";

const {ccclass, menu, property} = cc._decorator;
@ccclass
@menu('病毒/Virus1')
//河豚病毒 
export default class Virus1 extends Virus {
    target:cc.Node = null;
    alertMagSqr = 200*200;
    boomed = false;
    speedRatio = 1;
    onLoad(){
        super.onLoad();
        this.target = SceneManager.ins.findScene(PlayScene).panda.node;
    }
    onOutPool(){
        super.onOutPool();
        this.node.scale = 1;
        this.speedRatio = 1;
        this.boomed = false;
        this.node.angle = 0;
    };
    start(){
        this.anima.play("idle");
    }
    update (dt) {
        if(!this.playing){
            return;
        }
        if(this.droping){
            this.updateDrop(dt);
            return;
        }
        if(this.velocity){
            this.node.position = this.node.position.add(this.velocity.mul(dt*this.speedRatio));
            let magSqr = this.node.position.sub(this.target.position).magSqr();
            if(magSqr<this.alertMagSqr){
                if(!this.boomed){
                    this.boom();
                }
            }
        }
    }
    boom(){
        this.boomed = true;
        this.anima.play("boom");
        this.speedRatio = 0.2;
    }
    boomEnd(){
        this.anima.play("rotate");
    }
}
