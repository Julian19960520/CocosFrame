import { Util } from "../CocosFrame/Util";
import PhyObject from "./PhyObject";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panda extends cc.Component {
    @property(cc.Node)
    mask:cc.Node = null;
    @property(cc.Node)
    glasses:cc.Node = null;
    onLoad(){

    }
    reset(){
        this.mask.active = false;
        this.glasses.active = false;
    }
    onCollisionEnter(other:cc.Collider, self){
        if(other.node.group == "Virus"){
            if(this.glasses.active){
                this.glasses.active = false;
                this.playDropAnim(this.glasses.getComponent(cc.Sprite).spriteFrame);
            }else if(this.mask.active){
                this.mask.active = false;
                this.playDropAnim(this.mask.getComponent(cc.Sprite).spriteFrame);
            }else{
                this.node.dispatchEvent(Util.newCustomEvent("gameOver", true));
            }
        }
        if(other.node.group == "Prop"){
            if(other.node.name == "mask" && this.mask.active == false){
                this.mask.active = true;
                other.node.dispatchEvent(Util.newCustomEvent("returnPool"));
            }
            if(other.node.name == "glasses" && this.glasses.active == false){
                this.glasses.active = true;
                other.node.dispatchEvent(Util.newCustomEvent("returnPool"));
            }
        }
    }
    public playDropAnim(spriteFrame){
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
        this.node.parent.addChild(node);
        node.position = this.node.position;
        let phyObject = node.addComponent(PhyObject);
        phyObject.velocity = cc.v2( Util.random(-100, 100), Util.random(300, 500));
        phyObject.g = 1200;
        setTimeout(() => {
            node.removeFromParent();
        }, 3000);
    }
}
