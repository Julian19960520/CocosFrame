import Top from "../Frame/Top";
import SceneManager from "../Frame/SceneManager";
import MessageBox from "../Frame/MessageBox";
import { FarmController } from "./FarmController";
import { GoodsConfig } from "./dts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GoodsItem extends cc.Component {
    @property(cc.Label)
    costLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    goodsIcon: cc.Sprite = null;

    private data:GoodsConfig = null;
    onLoad(){
        this.node.on("setData",this.setData, this);
        this.node.on("click",this.onClick, this);
    }    
    onDestroy(){
        this.node.off("setData",this.setData, this);
        this.node.off("click",this.onClick, this);
    }    
    public setData(data){
        cc.log(data);
        this.data = data;
        this.costLabel.string = data.cost;
        this.nameLabel.string = data.name;
        cc.loader.loadRes(`Atlas/Icon/Seed/${data.id}`,cc.SpriteFrame, (err, spriteFrame)=>{
            this.goodsIcon.spriteFrame = spriteFrame;
        });
    }
    public onClick(){
        if(FarmController.coinEnough(this.data.cost)){
            SceneManager.ins.OpenPanelByName("MessageBox", (messageBox:MessageBox)=>{
                messageBox.label.string = `是否话费${this.data.cost}金币购买${this.data.name}?`
                messageBox.onOk = ()=>{
                    this.buySeed();
                }
            });
        }else{
            Top.ins.showToast("金币不足");
        }
    }
    public buySeed(){
        FarmController.changeCoin(-this.data.cost);
        FarmController.changeSeedCnt(this.data.fk, this.data.cnt);
    }
}
