import ScrollList from "../Frame/ScrollList";
import { DB } from "../Frame/DataBind";
import SceneManager from "../Frame/SceneManager";
import FarmScene from "./FarmScene";
import Field from "./Field";
import { FarmController } from "./FarmController";
import { FieldData, PropData, Type, PropItemData, PlantItemData } from "./dts";
import { Config } from "./Config";
import MessageBox from "../Frame/MessageBox";

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
export default class PropBag extends DB.DataBindComponent {

    @property(cc.Button)
    public closeBtn: cc.Button = null;
    @property(cc.Label)
    public emptyLabel: cc.Label = null;
    @property(ScrollList)
    public scrollList: ScrollList = null;

    onLoad(){
        this.Bind("user/props",(userSeeds:any[])=>{
            let empty = userSeeds.length <= 0;
            this.scrollList.node.active = !empty;
            this.emptyLabel.node.active = empty;
            this.scrollList.setDataArr(userSeeds);
        });
        this.scrollList.node.on("selectItem", this.onSelectItem, this);
    };

    public onOpen(){
        this.scrollList.selectItemByIdx(0);
    }
    public onClose(){
        let farmScene = SceneManager.ins.findScene(FarmScene);
        farmScene.clearSelectField();
    }
    //当切换道具时
    private propData:PropData = null;
    public onSelectItem(node, data:PropData){
        this.propData = data;
        let conf = Config.PropConfById(data.id);
        let selectFunc = null;
        if(conf.type == Type.Spade){
            selectFunc = (fieldData:FieldData)=>{
                if(!fieldData.itemData){
                    return false;
                }
                return fieldData.itemData.type == Type.Plant
                        ||fieldData.itemData.type == Type.Warehouse
                        ||fieldData.itemData.type == Type.Scarecrow
                        ||fieldData.itemData.type == Type.Doghouse
                        ||fieldData.itemData.type == Type.Sprinkler
                        ||fieldData.itemData.type == Type.Shit
                        ||fieldData.itemData.type == Type.Phonograph;
            };
        }else{
            selectFunc = (fieldData:FieldData)=>{
                return fieldData.itemData == null;
            };
        }
        let farmScene = SceneManager.ins.findScene(FarmScene);
        farmScene.beginSelectField(selectFunc, this.onSelectField.bind(this) );
    }
    //当点击土地时
    private onSelectField(field:Field){
        if(this.propData){
            let conf = Config.PropConfById(this.propData.id);
            if(conf.type == Type.Spade){
                let itemData = field.getFieldData().itemData;
                if(itemData.type == Type.Plant){
                    //铲除植物
                    let plantItemData = itemData as PlantItemData;
                    let plantConf = Config.PlantConfById(plantItemData.fk);
                    if(plantItemData && plantItemData.curState == plantConf.stateCnt){
                        //已成熟
                        FarmController.harvestPlant(plantItemData);
                        field.stopSelectBoxAnim();
                    }else{
                        //未成熟
                        SceneManager.ins.curScene.OpenPanelByName("MessageBox",(box:MessageBox)=>{
                            box.label.string = "植物还没成熟！是否继续移除？";
                            box.onOk = ()=>{
                                FarmController.removeItemData(field.pos);
                                field.stopSelectBoxAnim();
                            };
                        });
                    }
                }else if(itemData.type == Type.Warehouse
                        ||itemData.type == Type.Scarecrow
                        ||itemData.type == Type.Doghouse
                        ||itemData.type == Type.Sprinkler
                        ||itemData.type == Type.Shit
                        ||itemData.type == Type.Phonograph){
                    //铲除道具
                    let propItemData = itemData as PropItemData;
                    FarmController.changePropCnt(propItemData.fk, 1);
                    FarmController.removeItemData(field.pos);
                    field.stopSelectBoxAnim();
                } 
            }else{
                //放置道具
                FarmController.placeProp(this.propData.id, field.pos);
                FarmController.changePropCnt(this.propData.id, -1);
                field.stopSelectBoxAnim();
            }
        }
    }
}
