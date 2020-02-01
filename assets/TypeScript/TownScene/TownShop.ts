import { TownShopData } from "../FarmScene/dts";
import SceneManager from "../Frame/SceneManager";
import TownShopPanel from "./TownShopPanel";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TownShop extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    private townShopData:TownShopData = null;

    onLoad(){
        this.node.on("click", this.onClick, this);
    }
    public setData(data:TownShopData){
        this.townShopData = data;
        this.label.string = data.text;
    }
    onClick(){
        SceneManager.ins.OpenPanelByName("TownShopPanel",(panel:TownShopPanel)=>{
            panel.setData(this.townShopData);
        });
    }
}
