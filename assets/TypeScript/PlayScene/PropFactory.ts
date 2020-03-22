
import { PoolManager } from "../CocosFrame/PoolManager";
import Virus from "./Virus";
import { Util } from "../CocosFrame/Util";
import Prop from "./Prop";
import ScreenRect from "../CocosFrame/ScreenRect";
import { PrefabPath } from "../CocosFrame/Config";
const {ccclass, property} = cc._decorator;

@ccclass
export default class PropFactory extends cc.Component {

    private playing = false;
    private timer = 0;
    private interval = 4;

    public begin(){
        this.timer = 0;
        this.playing = true;
    }
    public pause(){
        this.playing = false;
    }
    public resume(){
        this.playing = true;
    }
    public clear(){
        for(let i=this.node.childrenCount-1;i>=0;i--){
            this.node.children[i].dispatchEvent(Util.customEvent("returnPool",false,{}));
        }
    }

    update(dt){
        if(!this.playing){
            return;
        }
        this.timer += dt;
        if(this.timer > this.interval){
            this.timer = 0;
            this.generateProp(Util.randomInt(1,3));
        }
    }
    generateProp(v){
        let node:cc.Node = null;
        switch(v){
            case 1:{
                node = PoolManager.getInstance(PrefabPath.mask);
                break;
            }
            case 2:{
                node = PoolManager.getInstance(PrefabPath.glasses);
                break;
            }
            case 3:{
                node = PoolManager.getInstance(PrefabPath.disinfection);
                break;
            }
        }
        this.node.addChild(node);
        let prop = node.getComponent(Prop);
        prop.node.x = Util.random(-ScreenRect.width/2, ScreenRect.width/2);
        prop.node.y = -ScreenRect.height/2;
        let vx = Util.random(50, 80) * (prop.node.x>0 ? -1:1);
        let vy = Util.random(800, 1200);
        prop.velocity = cc.v2(vx, vy);
    }
    onCollisionExit(other:cc.Collider, self){
        if(other.node.group == "Prop"){
            other.node.dispatchEvent(Util.customEvent("returnPool",false,{}));
        }
    }
}
