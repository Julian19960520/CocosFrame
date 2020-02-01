import SeedBag from "./SeedBag";
import SceneManager, { ShiftAnima } from "../Frame/SceneManager";
import PropBag from "./PropBag";
import FarmScene from "./FarmScene";
import FightMenu from "./FightMenu";

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
export default class Menu extends cc.Component {

    @property(cc.Button)
    seedBagBtn: cc.Button = null;
    @property(cc.Button)
    propBtn: cc.Button = null;
    @property(cc.Button)
    wareHouseBtn: cc.Button = null;
    @property(cc.Button)
    cookingBenchBtn: cc.Button = null;
    @property(cc.Button)
    fightBtn: cc.Button = null;

    @property(SeedBag)
    seedBag: SeedBag = null;
    @property(PropBag)
    propBag: PropBag = null;
    private oriPos = null;
    onLoad(){
        this.oriPos = this.node.position;
        this.seedBagBtn.node.on("click", this.onSeedBagBtnClick, this);
        this.propBtn.node.on("click", this.onPropBtnClick, this);
        this.wareHouseBtn.node.on("click", this.onWareHouseBtnClick, this);
        this.cookingBenchBtn.node.on("click", this.onCookingBenchBtnClick, this);
        this.fightBtn.node.on("click", this.onFightBtnClick, this);

        this.seedBag.closeBtn.node.on("click", this.closeSeedBag, this);
        this.propBag.closeBtn.node.on("click", this.closePropBag, this);
    }

    onSeedBagBtnClick(){
        this.moveDown(this.node);
        this.moveUp(this.seedBag.node);
        this.seedBag.onOpen();
    }
    closeSeedBag(){
        this.moveUp(this.node);
        this.moveDown(this.seedBag.node);
        this.seedBag.onClose();
    }
    onPropBtnClick(){
        this.moveDown(this.node);
        this.moveUp(this.propBag.node);
        this.propBag.onOpen();
    }
    closePropBag(){
        this.moveUp(this.node);
        this.moveDown(this.propBag.node);
        this.propBag.onClose();
    }
    onWareHouseBtnClick(){
        SceneManager.ins.curScene.OpenPanelByName("WareHousePanel",()=>{
            
        });
    }
    onCookingBenchBtnClick(){
        SceneManager.ins.curScene.OpenPanelByName("CookingBenchPanel",()=>{
            
        });
    }
    onFightBtnClick(){
        SceneManager.ins.Enter("FightScene", ShiftAnima.simpleShift);
    }
    
    public moveDown(node:cc.Node, callback = null){
        let oriPos = this.oriPos;
        let targetPos = cc.v2(this.oriPos.x, this.oriPos.y-200);
        node.position = oriPos;
        cc.tween(node).to(0.5, {position: targetPos}, { easing: 'quintOut'}).call(()=>{
            if(callback){
                callback();
            }
        }).start();
    }
    public moveUp(node:cc.Node, callback = null){
        let oriPos = cc.v2(this.oriPos.x, this.oriPos.y-200);
        let targetPos = this.oriPos;
        node.position = oriPos;
        cc.tween(node).to(0.5, {position: targetPos}, { easing: 'quintOut'}).call(()=>{
            if(callback){
                callback();
            }
        }).start();
    }
}
