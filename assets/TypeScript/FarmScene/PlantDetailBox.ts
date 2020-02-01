import { PlantItemData } from "./dts";
import { Config } from "./Config";
import { FarmController } from "./FarmController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlantDetailBox extends cc.Component {
    @property(cc.Sprite)
    sprite:cc.Sprite = null;
    @property(cc.Label)
    nameLabel:cc.Label = null;
    @property(cc.Label)
    waterLabel:cc.Label = null;
    @property(cc.Label)
    productionLabel:cc.Label = null;
    public setData(plantItemData:PlantItemData){
        let conf = Config.PlantConfById(plantItemData.fk);
        let productConf = FarmController.getProducts(plantItemData);
        let mainProduct = productConf.products[0];
        this.nameLabel.string = `${conf.name}(${productConf.quality})`;
        this.waterLabel.string = `浇水（${plantItemData.waterTimes}/${conf.needWaterTimes}）`;
        this.productionLabel.string = `产量（${mainProduct.cnt}/${mainProduct.cnt}）`;
    }
}
