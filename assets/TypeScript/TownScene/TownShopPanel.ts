import Panel from "../Frame/Panel";
import ScrollList from "../Frame/ScrollList";
import { TownShopData } from "../FarmScene/dts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TownShopPanel extends Panel {
    @property(ScrollList)
    scrollList:ScrollList = null;
    public setData(data:TownShopData){
        this.scrollList.setDataArr(data.goods);
    }
}
