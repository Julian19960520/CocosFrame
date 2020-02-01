import ScrollList from "../Frame/ScrollList";
import { DB } from "../Frame/DataBind";
import SceneManager from "../Frame/SceneManager";
import Scene from "../Frame/Scene";
import FarmScene from "./FarmScene";
import Field from "./Field";
import { SeedData, FieldData } from "./dts";
import { Config } from "./Config";
import PlaceTipBox from "./PlaceTipBox";
import { FarmController } from "./FarmController";

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
export default class SeedBag extends DB.DataBindComponent {

    @property(cc.Button)
    public closeBtn: cc.Button = null;
    @property(cc.Button)
    public shopBtn: cc.Button = null;
    @property(cc.Label)
    public emptyLabel: cc.Label = null;
    @property(ScrollList)
    public scrollList: ScrollList = null;

    // private placeTipBox:PlaceTipBox = null;
    onLoad(){
        this.Bind("user/seeds",(userSeeds:any[])=>{
            let empty = userSeeds.length <= 0;
            this.scrollList.node.active = !empty;
            this.emptyLabel.node.active = empty;
            this.scrollList.setDataArr(userSeeds);
        });
        this.shopBtn.node.on("click", this.onShopBtnClick, this);
        this.scrollList.node.on("selectItem", this.onSelectItem, this);
    };

    private onShopBtnClick(){
        SceneManager.ins.curScene.OpenPanelByName("SeedShopPanel",()=>{
            
        });
    }

    public onOpen(){
        
        this.scrollList.selectItemByIdx(0);
    }
    public onClose(){
        let farmScene = SceneManager.ins.findScene(FarmScene);
        farmScene.clearSelectField();
    }
    //当切换种子时
    private seedData = null;
    public onSelectItem(item, data:SeedData){
        this.seedData = data;
        let farmScene = SceneManager.ins.findScene(FarmScene);
        farmScene.beginSelectField(
            (fieldData:FieldData)=>{
                return fieldData.itemData == null;
            },
            this.onSelectField.bind(this)
        );
    }
    //当点击土地时
    private onSelectField(field:Field){
        if(this.seedData){
            let conf = Config.SeedConfById(this.seedData.id);
            FarmController.SowPlant(conf.plantId, field.pos);
            FarmController.changeSeedCnt(this.seedData.id, -1);
            field.stopSelectBoxAnim();
        }
    }
}
