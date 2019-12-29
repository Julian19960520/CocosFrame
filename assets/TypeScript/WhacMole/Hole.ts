import { PoolManager } from "../Frame/PoolManager";
import MoleBase from "./Mole/MoleBase";

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
export default class Hole extends cc.Component {

    @property(cc.Node)
    moleContent: cc.Node = null;

    private mole:MoleBase = null;
    public Reset(){
        
    }
    public onBeatStart(data){
        let moleNode = null;
        switch(data.m){
            case 1:
                moleNode = PoolManager.getInstance("Scene/WhacMoleScene/NormalMole/NormalMole");
                break;
            case 2:
                moleNode = PoolManager.getInstance("Scene/WhacMoleScene/BucketMole/BucketMole");
                break;
        }
        let mole = moleNode.getComponent(MoleBase);
        if(mole){
            this.mole = mole;
            this.moleContent.addChild(moleNode);
            this.mole.onBeatStart(data);
        }else{
            cc.error("生成地鼠失败");
        }
    }
    public onBeatEnd(){
        if(this.mole){
            this.mole.onBeatEnd(()=>{
                this.moleContent.removeChild(this.mole.node);
                PoolManager.returnInstance(this.mole.node);
                this.mole = null;
            });
        }
    }
}
