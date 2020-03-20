import { PoolManager } from "../Frame/PoolManager";
import { Util } from "../Frame/Util";
import Pig from "../FightScene/Pig";

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
export default class PigFactory extends cc.Component {
    private conf = {
        list:[
            {
                type:"Random",

            }
        ]
    }
    private ROF = 1;
    private timer = 0;
    private playing = false;
    onLoad(){
        PoolManager.preload([
            "Scene/FightScene/Pig/Pig"
        ]);
    }
    update(dt){
        if(!this.playing){
            return;
        }
        this.timer += dt;
        if(this.timer > 1/this.ROF){
            this.timer = 0;
            let pigNode = PoolManager.getInstance("Scene/FightScene/Pig/Pig");
            this.node.addChild(pigNode);

            let idx = Util.random(-2, 2);
            pigNode.position = cc.v2(idx*128, 0);
            let pig = pigNode.getComponent(Pig);
            pig.velocity = cc.v2(0, -100);
            pig.hper.HpMax = pig.hper.Hp = 3;
            pig.play();
            pig.init();
        }
    }
    public play(){
        this.playing = true;
    }
    public stop(){
        this.playing = false;
        let pigs = this.node.getComponentsInChildren(Pig);
        for(let i=0;i<pigs.length;i++){
            pigs[i].stop();
        }
    }
    public clear(){
        let pigs = this.node.getComponentsInChildren(Pig);
        for(let i=0;i<pigs.length;i++){
            PoolManager.returnInstance(pigs[i].node);
        }
    }
}
