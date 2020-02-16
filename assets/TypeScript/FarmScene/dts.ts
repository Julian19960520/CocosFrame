export enum Type {
    Default = 0,
    Seed,
    Obstacle,
    Warehouse,
    Doghouse,
    Sprinkler,
    Plant,
    Scarecrow,
    Spade,
    Shit,
    Phonograph,
}
export enum WeaponType {
    Default = 0,
    Carrot = 1,
}

export declare namespace wx{
	function onShow(callback);
    function shareAppMessage(obj:{title?: string, imageUrl?:string, query?:string, imageUrlId?:string});
};
//配置
export class TownShopData{
    skin:number;
    text:string;
    goods:GoodsConfig[];
}
export class GoodsConfig{
    id: number;
    type: Type;
    fk:number;
    name:string;
    cost:number;
    cnt:number;
}
export class SeedConfig{
    id: number;
    name:string;
    plantId:number;
}
       
export class PlantConfig{
    id: number;
    name:string;
    duration:number;            //生长时间
    stateCnt:number;            //状态数
    needWaterTimes:number;      //需要浇水数
    waterCoolingTime:number;    //浇水冷却
    products:{
        perfect:{id:number,cnt:number}[], //完美
        good:{id:number,cnt:number}[],    //优质
        normal:{id:number,cnt:number}[],  //普通
    }
}
export class ProductConfig{
    id:number;
    name:string;
    price:number;
}
export class PropConfig{
    id:number;
    name:string;
    type:Type;
}
export class FieldData{
    itemData:ItemData;
    open:boolean;
}
export class ItemConfig{
    id:number;
    type:Type;
    
}
//玩家拥有的数据
export class ItemData{
    uuid:number;
    type:Type;
    fk:number;
    pos:number[];
}
export class PlantItemData extends ItemData{
    startTime:number;
    lastWaterTime:number;
    waterTimes:number;
    curState?:number;       
    showWaterBtn?:boolean;
    clockListeners?:any[];
    stateListeners?:any[];
    waterListeners?:any[];
}
export class PropItemData extends ItemData{
    
}
export class SeedData{
    id:number;
    cnt:number;
}

export class ProductData{
    id:number;
    cnt:number;
}
export class PropData{
    id:number;
    cnt:number;
}
