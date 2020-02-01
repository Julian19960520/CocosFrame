import Top from "../Frame/Top";
import SceneManager from "../Frame/SceneManager";
import MessageBox from "../Frame/MessageBox";
import { FarmController } from "./FarmController";
import { ProductData } from "./dts";
import { Config } from "./Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ProductItem extends cc.Component {
    @property(cc.Label)
    priceLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    private data:ProductData = null;
    onLoad(){
        this.node.on("setData",this.setData, this);
        this.node.on("click",this.onClick, this);
    }    
    onDestroy(){
        this.node.off("setData",this.setData, this);
        this.node.off("click",this.onClick, this);
    }    
    public setData(data:ProductData){
        this.data = data;
        let conf = Config.ProductConfById(data.id);
        this.priceLabel.string = `${conf.price}`;
        this.nameLabel.string = `${conf.name}x${data.cnt}`;
        cc.loader.loadRes(`Atlas/Icon/Product/${data.id}`,cc.SpriteFrame, (err, spriteFrame)=>{
            this.icon.spriteFrame = spriteFrame;
        });
    }
    public onClick(){
        let conf = Config.ProductConfById(this.data.id);
        SceneManager.ins.OpenPanelByName("MessageBox", (messageBox:MessageBox)=>{
            messageBox.label.string = `是否卖出${conf.name}?`
            messageBox.onOk = ()=>{
                FarmController.changeCoin(conf.price * this.data.cnt);
                FarmController.changeProductCnt(this.data.id, -this.data.cnt);
            }
        });
    }
}
