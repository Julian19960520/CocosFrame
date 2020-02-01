import Panel from "../Frame/Panel";
import ScrollList from "../Frame/ScrollList";
import { Config } from "./Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SeedShopPanel extends Panel {
    @property(ScrollList)
    scrollList:ScrollList = null;
    onLoad(){
        super.onLoad();
        this.scrollList.setDataArr(Config.configGoods);
    }
}
