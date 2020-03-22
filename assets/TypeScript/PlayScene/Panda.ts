import { Util } from "../CocosFrame/Util";
import PhyObject from "./PhyObject";
import { DB } from "../CocosFrame/DataBind";
import Virus from "./Virus";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panda extends cc.Component {
    @property(cc.Node)
    mask:cc.Node = null;
    @property(cc.Node)
    glasses:cc.Node = null;
    @property(cc.Node)
    disinfection:cc.Node = null;
    @property(cc.Node)
    flipGroup:cc.Node = null;
    @property(cc.Node)
    armNode:cc.Node = null;
    @property(cc.Sprite)
    emoji:cc.Sprite = null;

    anim:cc.Animation = null;

    _disinfectionTime = -0.001;
    _maskTime = -0.001;
    _glassesTime = -0.001;
    maxTime = 10;
    get disinfectionTime(){
        return this._disinfectionTime;
    };
    set disinfectionTime(v){
        DB.Set("game/disinfectionTime", v);
        this._disinfectionTime = v;
    };
    get maskTime(){
        return this._maskTime;
    };
    set maskTime(v){
        DB.Set("game/maskTime", v);
        this._maskTime = v;
    };
    get glassesTime(){
        return this._glassesTime;
    };
    set glassesTime(v){
        DB.Set("game/glassesTime", v);
        this._glassesTime = v;
    };
    onLoad(){
        this.anim = this.getComponent(cc.Animation);
        this.anim.play("pandaIdle");
        this.setEmoji(DB.Get("user/emoji1"));
    }
    update(dt){
        if(this.disinfectionTime>=0){
            this.disinfectionTime -= dt;
            if(this.disinfectionTime<0){
                this.disinfection.active = false;
                this.playDropAnim(this.disinfection.getComponent(cc.Sprite).spriteFrame);
                this.setEmoji(DB.Get("user/emoji1"));
            }
        }
        if(this.maskTime>=0){
            this.maskTime -= dt;
            if(this.maskTime<0){
                this.mask.active = false;
                this.playDropAnim(this.mask.getComponent(cc.Sprite).spriteFrame);
            }
        }
        if(this.glassesTime>=0){
            this.glassesTime -= dt;
            if(this.glassesTime<0){
                this.glasses.active = false;
                this.playDropAnim(this.glasses.getComponent(cc.Sprite).spriteFrame);
            }
        }
    }
    reset(){
        this.mask.active = false;
        this.glasses.active = false;
        this.disinfection.active = false;
        this.disinfectionTime = -0.0001;
        this.maskTime = -0.0001;
        this.glassesTime = -0.0001;
    }
    flipX(scaleX){
        this.flipGroup.scaleX = scaleX;
    }
    onCollisionEnter(other:cc.Collider, self){
        //碰到病毒，处理丢失道具 或 游戏结束
        if(other.node.group == "Virus"){
            let virus = other.node.getComponent(Virus);
            if(virus && virus.active){
                if(this.glasses.active){
                    this.glassesTime = 0;
                    virus.beginDrop();
                }else if(this.mask.active){
                    this.maskTime = 0;
                    virus.beginDrop();
                }else{
                    this.node.dispatchEvent(Util.customEvent("gameOver", true));
                }
            }
        }
        //碰到道具，处理获得道具
        if(other.node.group == "Prop"){
            if(other.node.name == "mask"){
                this.mask.active = true;
                this.maskTime = this.maxTime;
                other.node.dispatchEvent(Util.customEvent("returnPool"));
            }
            if(other.node.name == "glasses"){
                this.glasses.active = true;
                this.glassesTime = this.maxTime;
                other.node.dispatchEvent(Util.customEvent("returnPool"));
            }
            if(other.node.name == "disinfection"){
                this.disinfection.active = true;
                this.disinfectionTime = this.maxTime;
                other.node.dispatchEvent(Util.customEvent("returnPool"));
                this.setEmoji(DB.Get("user/emoji2"));
            }
        }
    }
    setEmoji(id){
        Util.loadRes(`Atlas/Panda/emoji${id}`, cc.SpriteFrame).then((spriteFrame:cc.SpriteFrame)=>{
            this.emoji.spriteFrame = spriteFrame;
        });
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
