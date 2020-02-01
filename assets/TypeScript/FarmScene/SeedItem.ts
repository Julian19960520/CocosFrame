import { Util } from "../Frame/Util";
import { FarmController } from "./FarmController";
import Top from "../Frame/Top";
import { DB } from "../Frame/DataBind";
import Scene from "../Frame/Scene";
import SceneManager from "../Frame/SceneManager";
import FarmScene from "./FarmScene";
import Field from "./Field";
import ScrollList from "../Frame/ScrollList";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SeedItem extends cc.Component {
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    seedIcon: cc.Sprite = null;
    @property(cc.Sprite)
    selectBox: cc.Sprite = null;

    private data = null;
    onLoad(){
        this.node.on("setData",this.setData, this);
        this.node.on("click", this.onClick, this);
        this.node.on("selectChange", this.onSelectChange, this);
    }

    onDestroy(){
        this.node.off("setData",this.setData, this);
    }    
    public setData(data){
        this.data = data;
        this.nameLabel.string =`${data.name}x${data.cnt}`;
        cc.loader.loadRes(`Atlas/Icon/Seed/${data.id}`,cc.SpriteFrame, (err, spriteFrame)=>{
            this.seedIcon.spriteFrame = spriteFrame;
        });
    }
    public onClick(){
        
    }
    private onSelectChange(b){
        this.selectBox.node.active = b;
    }
}
