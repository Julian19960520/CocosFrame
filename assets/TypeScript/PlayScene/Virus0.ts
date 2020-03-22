
import { Util } from "../CocosFrame/Util";
import Virus from "./Virus";
import SceneManager from "../CocosFrame/SceneManager";
import PlayScene from "./PlayScene";

const {ccclass, menu, property} = cc._decorator;
@ccclass
@menu('病毒/Virus0')
//普通病毒 
export default class Virus0 extends Virus {
    angleSpeed = 40;
    onOutPool(){
        super.onOutPool();
        this.angleSpeed = Util.random(50,100) * (Math.random()>0.5 ? 1 : -1);
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
            this.node.position = this.node.position.add(this.velocity.mul(dt));
        }
        this.node.angle += this.angleSpeed * dt;
    }
}
