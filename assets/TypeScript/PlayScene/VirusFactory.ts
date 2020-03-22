// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { PoolManager } from "../CocosFrame/PoolManager";
import { LvlConf, VirusInitData } from "../CocosFrame/dts";
import Virus from "./Virus";
import { Util } from "../CocosFrame/Util";
import ScreenRect from "../CocosFrame/ScreenRect";
import SceneManager from "../CocosFrame/SceneManager";
import PlayScene from "./PlayScene";
import { PrefabPath } from "../CocosFrame/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VirusFactory extends cc.Component {

    private playing = false;
    private timer = 0;

    public playConf(lvlConf:LvlConf){
        this.timer = 0;
        this.playing = true;
    }
    public pause(){
        this.playing = false;
        let viruses = this.node.getComponentsInChildren(Virus);
        for(let i=0; i<viruses.length; i++){
            viruses[i].pause();
        }
    }
    public resume(){
        this.playing = true;
        let viruses = this.node.getComponentsInChildren(Virus);
        for(let i=0; i<viruses.length; i++){
            viruses[i].resume();
        }
    }
    public clear(){
        for(let i=this.node.childrenCount-1;i>=0;i--){
            this.node.children[i].dispatchEvent(Util.customEvent("returnPool"));
        }
    }
    private ROF = 1;
    update(dt){ 
        if(!this.playing){
            return;
        }
        this.timer += dt;
        if(this.timer > 1/this.ROF){
            this.timer = 0;
            let playScene = SceneManager.ins.findScene(PlayScene);
            let type = Util.randomInt(0, 4);
            let x ,y;
            if(Math.random() < ScreenRect.width/(ScreenRect.height+ScreenRect.width)){
                x = Util.randomInt(-ScreenRect.width/2, ScreenRect.width/2);
                y = ScreenRect.height/2 * (Math.random()>0.5?1:-1);
            }else{
                y = Util.randomInt(-ScreenRect.height/2, ScreenRect.height/2);
                x = ScreenRect.width/2 * (Math.random()>0.5?1:-1);
            }
            let speed = Util.random(100,120);
            let dir = playScene.panda.node.position.sub(cc.v2(x,y));
            let velocity = dir.normalizeSelf().mulSelf(speed);
            this.generateVirus(type, x, y, velocity); 
        }
    }
    generateVirus(type,x,y,velocity){
        let node:cc.Node = null;
        switch(type){
            case 0:{
                node = PoolManager.getInstance(PrefabPath.virus0);
                break;
            }
            case 1:{
                node = PoolManager.getInstance(PrefabPath.virus1);
                break;
            }
            case 2:{
                node = PoolManager.getInstance(PrefabPath.virus2);
                break;
            }
            case 3:{
                node = PoolManager.getInstance(PrefabPath.virus3);
                break;
            }
            case 4:{
                node = PoolManager.getInstance(PrefabPath.virus4);
                break;
            }
            case 5:{
                node = PoolManager.getInstance(PrefabPath.virus5);
                break;
            }
        }
        this.node.addChild(node);
        let virus = node.getComponent(Virus);
        virus.node.x = x;
        virus.node.y = y;
        virus.setVelocity(velocity);
    }
    onCollisionExit(other:cc.Collider, self){
        if(other.node.group == "Virus"){
            other.node.dispatchEvent(Util.customEvent("returnPool"));
        }
    }
}
