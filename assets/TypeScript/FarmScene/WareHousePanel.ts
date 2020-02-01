import Panel from "../Frame/Panel";
import ScrollList from "../Frame/ScrollList";
import { DB } from "../Frame/DataBind";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WareHousePanel extends Panel {
    @property(cc.ToggleContainer)
    toggleContainer:cc.ToggleContainer = null;
    @property(ScrollList)
    productScrollList:ScrollList = null;
    @property(ScrollList)
    propScrollList:ScrollList = null;

    onLoad(){
        super.onLoad();
        let check = new cc.Component.EventHandler();
        check.target = this.node;
        check.component = "WareHousePanel";
        check.handler = "onClick";       
        this.toggleContainer.checkEvents.push(check);
        this.propScrollList.node.active = false;
        this.Bind("user/products", (products)=>{
            this.productScrollList.setDataArr(products);
        })
        this.Bind("user/props", (props)=>{
            this.propScrollList.setDataArr(props);
        })
    }
    public onClick(toggle:cc.Toggle){
        let idx = this.toggleContainer.node.children.indexOf(toggle.node);

        this.productScrollList.node.active = false;
        this.propScrollList.node.active = false;
        
        switch(idx){
            case 0:{
                this.productScrollList.node.active = true; 
                this.productScrollList.setDataArr(DB.Get("user/products"));
                break;
            }
            case 1:{
                this.propScrollList.node.active = true;  
                this.propScrollList.setDataArr(DB.Get("user/props"));
                break;
            }
            case 2:{
                this.productScrollList.node.active = true; 
                this.productScrollList.setDataArr(DB.Get("user/products"));
                break;
            }
        }
    }
}
