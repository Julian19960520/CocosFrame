import Scene from "../Frame/Scene";
import SceneManager, { ShiftAnima } from "../Frame/SceneManager";
import { Config } from "../FarmScene/Config";
import { Util } from "../Frame/Util";
import { TownShopData } from "../FarmScene/dts";
import TownShop from "./TownShop";

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
export default class TownScene extends Scene {
    @property(cc.Button)
    guidepostBtn:cc.Button = null;
    @property(cc.Node)
    shopGroup:cc.Node = null;
    onLoad(){
        this.guidepostBtn.node.on("click", this.onGuidepostBtnClick, this);
        let shopDatas = Config.townShops;
        for(let i=0;i<shopDatas.length;i++){
            let shopData = shopDatas[i];
            Util.instantPrefab(`Scene/TownScene/TownShop/TownShop${shopData.skin}`).then((node)=>{
                this.shopGroup.children[i].addChild(node);
                let shop = node.getComponent(TownShop);
                shop.setData(shopData);
            });
        }
    }
    public onGuidepostBtnClick(){
        SceneManager.ins.Back(ShiftAnima.moveLeftShift);
    }
}

