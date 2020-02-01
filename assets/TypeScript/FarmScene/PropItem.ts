import Top from "../Frame/Top";
import SceneManager from "../Frame/SceneManager";
import MessageBox from "../Frame/MessageBox";
import { FarmController } from "./FarmController";
import { ProductData, PropData } from "./dts";
import { Config } from "./Config";
import { Util } from "../Frame/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PropItem extends cc.Component {
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Sprite)
    selectBox: cc.Sprite = null;

    private data:PropData = null;
    onLoad(){
        this.node.on("setData",this.setData, this);
        this.node.on("click",this.onClick, this);
        this.node.on("selectChange", this.onSelectChange, this);
    }    
    private onSelectChange(b){
        this.selectBox.node.active = b;
    }
    onDestroy(){
        this.node.off("setData",this.setData, this);
        this.node.off("click",this.onClick, this);
    }    
    public setData(data:PropData){
        this.data = data;
        let conf = Config.PropConfById(data.id);
        this.nameLabel.string = `${conf.name}x${data.cnt}`;
        cc.loader.loadRes(`Atlas/Icon/Prop/${data.id}`,cc.SpriteFrame, (err, spriteFrame)=>{
            this.icon.spriteFrame = spriteFrame;
        });
    }
    public onClick(){
        this.node.dispatchEvent(Util.newCustomEvent("UseProp", true, this.data));
    }
}
