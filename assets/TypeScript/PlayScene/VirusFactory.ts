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

const {ccclass, property} = cc._decorator;

@ccclass
export default class VirusFactory extends cc.Component {

    private playing = false;
    private timer = 0;
    private waveIdx = 0;
    private lvlConf:LvlConf = null;
    public playConf(lvlConf:LvlConf){
        this.lvlConf = lvlConf;
        this.timer = 0;
        this.playing = true;
        this.waveIdx = 0;
    }
    public end(){
        this.playing = false;
    }
    public clear(){
        for(let i=this.node.childrenCount-1;i>=0;i--){
            this.node.children[i].dispatchEvent(Util.newCustomEvent("returnPool",false,{}));
        }
    }

    update(dt){
        if(!this.playing){
            return;
        }
        if(!this.lvlConf){
            return;
        }
        this.timer += dt;
        while(this.waveIdx < this.lvlConf.virusList.length){
            let virusInitData = this.lvlConf.virusList[this.waveIdx];
            if(virusInitData.t <= this.timer){
                this.generateVirus(virusInitData);
                this.waveIdx++;
            }else{
                break;
            }
        }
    }
    generateVirus(virusInitData:VirusInitData){
        let node:cc.Node = null;
        switch(virusInitData.v){
            case 1:{
                node = PoolManager.getInstance("Prefab/Virus/virus1");
                break;
            }
            case 2:{
                node = PoolManager.getInstance("Prefab/Virus/virus2");
                break;
            }
            case 3:{
                node = PoolManager.getInstance("Prefab/Virus/virus3");
                break;
            }
            case 4:{
                node = PoolManager.getInstance("Prefab/Virus/virus4");
                break;
            }
            case 5:{
                node = PoolManager.getInstance("Prefab/Virus/virus5");
                break;
            }
        }
        this.node.addChild(node);
        let virus = node.getComponent(Virus);
        virus.node.x = virusInitData.x;
        virus.node.y = virusInitData.y;
        virus.velocity = cc.v2(virusInitData.vx, virusInitData.vy);

    }
    onCollisionExit(other:cc.Collider, self){
        if(other.node.group == "Virus"){
            other.node.dispatchEvent(Util.newCustomEvent("returnPool",false,{}));
        }
    }
}
