import Scene from "../Frame/Scene";
import SceneManager from "../Frame/SceneManager";
import { DB } from "../Frame/DataBind";
import { Util } from "../Frame/Util";
import { Type, ItemData, PlantItemData, PropItemData, WeaponType } from "../FarmScene/dts";
import { FarmController } from "../FarmScene/FarmController";
import { Config } from "../FarmScene/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends Scene {

    @property(cc.Label)
    label: cc.Label = null;
    onLoad () {
        //倒计时
        let count = 0;
        this.schedule(()=>{
            this.label.string = "loading" + ".".repeat(count%3);
            if(count >= 3){
                SceneManager.ins.Enter("FarmScene");//WhacMoleScene
            }
            count++;
        }, 0.2, 3);
        
        Config.load();
        this.login();
    }
    public login(){
        //初始化，模拟登录，获取服务器数据
        //玩家金币数
        DB.Set("user/coin", 1000);

        //土地网格
        let row = 5;
        let col = 12;
        let fieldDataGrid = [];
        for(let i=0;i<row;i++){
            let arr = [];
            for(let j=0;j<col;j++){
                arr.push({itemData:null});
            }
            fieldDataGrid.push(arr);
        }     
        DB.Set("user/fieldDataGrid", fieldDataGrid);

        //土地上的物品
        let time = Util.getTimeStamp();
        let itemDataArr:(ItemData|PlantItemData|PropItemData)[] = [
            {uuid:Util.newUuid(), type:Type.Plant,     pos:[2,1,1,1], fk:1, startTime: time, curState:0, waterTimes:0, lastWaterTime:0},
            {uuid:Util.newUuid(), type:Type.Sprinkler, pos:[2,2,1,1], fk:3 },
            {uuid:Util.newUuid(), type:Type.Scarecrow, pos:[3,2,1,1], fk:4 },
            {uuid:Util.newUuid(), type:Type.Shit,      pos:[3,3,1,1], fk:2 },
        ]

        for(let i=0; i<row; i++){
            for(let j=4; j<col; j++){
                let id = 4;
                if(Math.random() < 0.4){
                    id = Util.random(1,4);
                }
                itemDataArr.push({uuid:Util.newUuid(), type:Type.Obstacle, fk:id, pos:[i,j,1,1]});
            }
        }
        DB.Set("user/itemDataArr", itemDataArr);
        //将物品放置到地块上
        for(let i=0;i<itemDataArr.length;i++){
            let itemData = itemDataArr[i];
            let pos = itemData.pos;
            for(let a=0; a<pos[2];a++){
                for(let b=0; b<pos[3];b++){
                    let filedData = fieldDataGrid[pos[0]+a][pos[1]+b];
                    filedData.itemData = itemData;
                }
            }
        }
        DB.Set("user/seeds",[
            {id:1, name:"胡萝卜种", plantId:1, cnt:3},
            {id:2, name:"青萝卜种", plantId:2, cnt:1},
        ]);
        DB.Set("user/products",[
            {id:1, cnt:2},
        ]);
        DB.Set("user/props",[
            {id:1, cnt:2},
            {id:2, cnt:2},
            {id:3, cnt:2},
            {id:4, cnt:2},
            {id:5, cnt:2},
        ]);
        DB.Set("user/wallLevel", 1);
        DB.Set("user/allWeapons", [
            {idx:0, type:WeaponType.Banana},
            {idx:1, type:WeaponType.Carrot},
            {idx:2, type:WeaponType.Egg},
            {idx:3, type:WeaponType.Grape},
            {idx:4, type:WeaponType.HamiMelon},
            {idx:5, type:WeaponType.Lemon},
            {idx:6, type:WeaponType.Pineapple},
            {idx:7, type:WeaponType.Strawberry},
            {idx:8, type:WeaponType.Tomato},
        ]);
        DB.Set("user/weaponSlots", [
            {idx:0, lock:false, type:WeaponType.Carrot},
            {idx:1, lock:false, type:WeaponType.Default},
            {idx:2, lock:true, type:WeaponType.Default},
            {idx:3, lock:true, type:WeaponType.Default},
            {idx:4, lock:true, type:WeaponType.Default},
        ]);
        //
        FarmController.runPlantGrowThread(itemDataArr);
    }
}
