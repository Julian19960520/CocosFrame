import { Type, PlantItemData, PlantConfig, ItemData, PropItemData } from "../FarmScene/dts";
import { Util } from "../Frame/Util";
import GameManager from "../Frame/GameManager";
import { DB } from "../Frame/DataBind";
import { Config } from "./Config";
import SceneManager from "../Frame/SceneManager";
import FarmScene from "./FarmScene";

export class FarmController extends cc.Component {
    // 绑定/解绑事件
    private static bindImp(data, name, callback){
        let listeners = data[name] || [];
        listeners.push(callback);
        data[name] = listeners;
    }
    private static unbindImp(data, name, callback){
        let listeners = data[name] || [];
        let idx = listeners.indexOf(callback);
        if(idx>=0){
            listeners.splice(idx,1);
        }
    }
    public static bindPlantState(plantItemData, callback){
        FarmController.bindImp(plantItemData, "stateListeners", callback);
    }
    public static unbindPlantState(plantItemData, callback){
        FarmController.unbindImp(plantItemData, "stateListeners", callback);
    }
    public static bindPlantClock(plantItemData, callback){
        FarmController.bindImp(plantItemData, "clockListeners", callback);
    }
    public static unbindPlantClock(plantItemData, callback){
        FarmController.unbindImp(plantItemData, "clockListeners", callback);
    }
    public static bindPlantWater(plantItemData, callback){
        FarmController.bindImp(plantItemData, "waterListeners", callback);
    }
    public static unbindPlantWater(plantItemData, callback){
        FarmController.unbindImp(plantItemData, "waterListeners", callback);
    }
    //控制植物生长线程
    public static runPlantGrowThread(itemDataArr:any[]){
        let calcuStateFunc = (time, plantItemData:PlantItemData, plantConfig:PlantConfig)=>{
            let state = Math.floor((time-plantItemData.startTime) / (plantConfig.duration/plantConfig.stateCnt) );
            state = Math.min(plantConfig.stateCnt, state);
            return state;
        }
        //初始化
        GameManager.Ins.startSchedule(()=>{
            let time = Util.getTimeStamp();
            for(let i=0; i<itemDataArr.length; i++){       
                let plantItemData:PlantItemData = itemDataArr[i];
                if(itemDataArr[i].type != Type.Plant){
                    continue;
                }
                let plantConf = Config.PlantConfById(plantItemData.fk);
                let state = calcuStateFunc(time, plantItemData, plantConf);
                let isComplete = (state == plantConf.stateCnt);
                if(!isComplete){
                    //时间改变
                    let listeners = plantItemData.clockListeners;
                    if(listeners){
                        for(let j=0;j<listeners.length;j++){
                            listeners[j](time-plantItemData.startTime, plantConf.duration);
                        }
                    }
                    //浇水状态改变
                    if(!plantItemData.showWaterBtn 
                            && time - plantItemData.lastWaterTime > plantConf.waterCoolingTime
                            && plantItemData.waterTimes < plantConf.needWaterTimes){
                        plantItemData.showWaterBtn = true;
                        listeners = plantItemData.waterListeners;
                        if(listeners){
                            for(let j=0;j<listeners.length;j++){
                                listeners[j](true);
                            }
                        }
                    }
                }
                //状态改变
                if(state != plantItemData.curState){
                    plantItemData.curState = state;
                    let listeners = plantItemData.stateListeners;
                    if(listeners){
                        for(let j=0;j<listeners.length;j++){
                            listeners[j](state, isComplete);
                        }
                    }
                }  
            }
        }, 1, cc.macro.REPEAT_FOREVER)
    }
    //播种植物植物
    public static SowPlant(plantId, pos){
        let iRow = pos[0]+pos[2]-1;
        let iCol = pos[1]+pos[3]-1;
        let plantConfig = Config.PlantConfById(plantId);
        let time = Util.getTimeStamp();
        let plantItemData:PlantItemData = {
            uuid:Util.newUuid(),
            fk : plantId,
            type : Type.Plant, 
            pos : pos,
            startTime : time,
            curState : 0,
            showWaterBtn : false,
            waterTimes:0,
            lastWaterTime:time,
        }
        let itemDataArr:any[] = DB.Get("user/itemDataArr");
        itemDataArr.push(plantItemData);
        let fieldDataGrid:any[][] = DB.Get("user/fieldDataGrid");
        let fieldData = fieldDataGrid[iRow][iCol];
        fieldData.itemData = plantItemData;
        cc.director.emit("SowPlant", plantItemData);
    }
    //收割植物
    public static harvestPlant(plantItemData:PlantItemData){
        FarmController.removeItemData(plantItemData.pos);
        let farmScene = SceneManager.ins.findScene(FarmScene);
        //播放农作物飞入仓库动画
        farmScene.playHarvestPlantAnim(plantItemData,()=>{
            //加农作物
            let res = FarmController.getProducts(plantItemData);
            let products = res.products;
            for(let i=0;i<products.length;i++){
                FarmController.changeProductCnt(products[i].id, products[i].cnt);
            } 
        })
    }
    //同时从itemDataArr和fieldDataGrid中移除ItemData
    public static removeItemData(pos){
        let fieldDataGrid:any[][] = DB.Get("user/fieldDataGrid");
        let iRow = pos[0]+pos[2]-1;
        let iCol = pos[1]+pos[3]-1;
        let fieldData = fieldDataGrid[iRow][iCol];
        let itemData = fieldData.itemData;
        let itemDataArr:any[] = DB.Get("user/itemDataArr");
        let idx = itemDataArr.indexOf(itemData);
        if(idx>=0){
            itemDataArr.splice(idx, 1);
            fieldData.itemData = null;
        }
        cc.director.emit("RemoveItemData", itemData);
        return itemData;
    }
    //根据植物数据计算将获得的产品
    public static getProducts(plantItemData:PlantItemData){
        let plantConf = Config.PlantConfById(plantItemData.fk);
        let products:{id:number, cnt:number}[] = null;
        let quality = "";
        if(plantItemData.waterTimes >= plantConf.needWaterTimes){
            quality = "完美";
            products = plantConf.products.perfect;
        }else if(plantItemData.waterTimes == plantConf.needWaterTimes-1){
            quality = "优质";
            products = plantConf.products.good;
        }else{
            quality = "普通";
            products = plantConf.products.normal;
        }
        return {
            quality:quality,
            products:products,
        }
    }
    //给植物浇水
    public static wateringPlant(plantItemData:PlantItemData){
        plantItemData.lastWaterTime = Util.getTimeStamp();
        plantItemData.waterTimes++;
        plantItemData.showWaterBtn = false;
        let listeners = plantItemData.waterListeners;
        if(listeners){
            for(let j=0;j<listeners.length;j++){
                listeners[j](false);
            }
        }
    }
    
    //找到空的土地块位置
    public static findEmptyFieldPos(){
        let fieldDataGrid:any[][] = DB.Get("user/fieldDataGrid");
        for(let i=0; i<fieldDataGrid.length; i++){
            let fieldDataArr = fieldDataGrid[i];
            for(let j=0; j<fieldDataArr.length; j++){
                let fieldData = fieldDataArr[j];
                if(fieldData.itemData) continue;
                return [i, j, 1, 1]
            }
        }
        return null;
    }
    //找到所有空的土地块位置
    public static findAllEmptyFieldPos(){
        let fieldDataGrid:any[][] = DB.Get("user/fieldDataGrid");
        let res = [];
        for(let i=0; i<fieldDataGrid.length; i++){
            let fieldDataArr = fieldDataGrid[i];
            for(let j=0; j<fieldDataArr.length; j++){
                let fieldData = fieldDataArr[j];
                if(fieldData.itemData) continue;
                res.push([i, j, 1, 1]);
            }
        }
        return res;
    }
    //
    public static placeProp(propId, pos){
        let iRow = pos[0]+pos[2]-1;
        let iCol = pos[1]+pos[3]-1;
        let propConfig = Config.PropConfById(propId);
        let time = Util.getTimeStamp();
        let propItemData:PropItemData = {
            uuid : Util.newUuid(),
            fk : propId,
            type : propConfig.type, 
            pos : pos,
        }
        let itemDataArr:any[] = DB.Get("user/itemDataArr");
        itemDataArr.push(propItemData);
        let fieldDataGrid:any[][] = DB.Get("user/fieldDataGrid");
        let fieldData = fieldDataGrid[iRow][iCol];
        fieldData.itemData = propItemData;
        cc.director.emit("PlaceProp", propItemData);
        return propItemData;
    }
    //花钱
    public static changeCoin(delta){
        let coin = DB.Get("user/coin");
        coin += delta;
        DB.Set("user/coin", coin);
    }
    //金币是否足够
    public static coinEnough(cost){
        let coin = DB.Get("user/coin");
        return coin >= cost;
    }



    //改变物品数量
    public static changeCntImpl(id, delta, key, createDataFunc){
        if(delta == 0){
            return;
        }
        let userDatas:any[] = DB.Get(key);
        let data = userDatas.find((data)=>{
            return data.id == id;
        });
        if(data){
            if(data.cnt + delta > 0){
                //只是增减数量
                data.cnt += delta;
            }else{
                //减少到没了
                let idx = userDatas.indexOf(data);
                if(idx>=0){
                    userDatas.splice(idx, 1);
                }
            }
            DB.Invoke(key);
        }else{
            if(delta>0){
                //新加一个
                userDatas.push(createDataFunc());
                DB.Invoke(key);
            }else{
                //减少一个玩家不存在的，什么也不做
            }
        }
    }
    //改变道具数量
    public static changePropCnt(propId, delta){
        this.changeCntImpl(propId, delta,"user/props",()=>{
            return {
                id:propId,
                cnt:delta
            }
        });
    }
    //改变产品数量
    public static changeProductCnt(productId, delta){
        this.changeCntImpl(productId, delta,"user/products",()=>{
            return {
                id:productId,
                cnt:delta
            }
        });
    }
    public static changeSeedCnt(seedId, delta){
        this.changeCntImpl(seedId, delta,"user/seeds",()=>{
            let seedConfig = Config.SeedConfById(seedId);
            return {
                id : seedConfig.id,
                name : seedConfig.name,
                plantId : seedConfig.plantId,
                cnt : delta
            }
        });
    }
}
