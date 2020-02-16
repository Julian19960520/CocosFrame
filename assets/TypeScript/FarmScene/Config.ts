import {GoodsConfig, SeedConfig, PlantConfig, ProductConfig, Type, PropConfig, TownShopData, WeaponType, WeaponData, WeaponConfig } from "../FarmScene/dts";
import { DB } from "../Frame/DataBind";

export namespace Config{
    export let townShops:TownShopData[] = [
        {   
            skin:1, 
            text:"菠菜贱卖菠菜贱卖！",
            goods:[
                {id:1, type:Type.Seed, name:"胡萝卜种", cost:10, fk:1, cnt:1},
                {id:2, type:Type.Seed, name:"胡萝卜种", cost:10, fk:1, cnt:1},
                {id:3, type:Type.Seed, name:"胡萝卜种", cost:10, fk:1, cnt:1},
            ]
        },
        {   
            skin:2, 
            text:"谁TM买小米啊！",
            goods:[
                {id:1, type:Type.Seed, name:"小米", cost:10, fk:1, cnt:1},
                {id:2, type:Type.Seed, name:"胡萝卜种", cost:10, fk:1, cnt:1},
                {id:3, type:Type.Seed, name:"胡萝卜种", cost:10, fk:1, cnt:1},
            ]
        },
        {   
            skin:2, 
            text:"烤山药！大个的！",
            goods:[
                {id:1, type:Type.Seed, name:"小米", cost:10, fk:1, cnt:1},
                {id:2, type:Type.Seed, name:"胡萝卜种", cost:10, fk:1, cnt:1},
                {id:3, type:Type.Seed, name:"胡萝卜种", cost:10, fk:1, cnt:1},
            ]
        },
        {   
            skin:1, 
            text:"窝窝头！一块钱四个，嘿嘿！",
            goods:[
                {id:1, type:Type.Seed, name:"小米", cost:10, fk:1, cnt:1},
                {id:2, type:Type.Seed, name:"胡萝卜种", cost:10, fk:1, cnt:1},
                {id:3, type:Type.Seed, name:"胡萝卜种", cost:10, fk:1, cnt:1},
            ]
        },
    ]
    export let configGoods:GoodsConfig[] = [
        {id:1, type:Type.Seed, name:"胡萝卜种", cost:10, fk:1, cnt:1},
        {id:2, type:Type.Seed, name:"花种子", cost:20, fk:2, cnt:1},
        {id:3, type:Type.Seed, name:"粉萝卜种", cost:30, fk:3, cnt:1},
        {id:4, type:Type.Seed, name:"红萝卜种", cost:40, fk:4, cnt:1},
        {id:5, type:Type.Seed, name:"紫萝卜种", cost:50, fk:5, cnt:1},
    ]
    export let configSeed:SeedConfig[] = [
        {id:1, name:"胡萝卜种", plantId:1},
        {id:2, name:"花种子", plantId:2},
        {id:3, name:"粉萝卜种", plantId:3},
        {id:4, name:"红萝卜种", plantId:4},
        {id:5, name:"紫萝卜种", plantId:5},
    ]
    export let configPlant:PlantConfig[] = [
        {
            id:1, 
            name:"胡萝卜", 
            duration:12000, 
            stateCnt:2, 
            needWaterTimes: 2, 
            waterCoolingTime:4000, 
            products:{
                perfect:[{id:1,cnt:4}],
                good:[{id:1,cnt:4}],
                normal:[{id:1,cnt:4}],
            },
        },
        {
            id:2, 
            name:"花", 
            duration:24000, 
            stateCnt:3, 
            needWaterTimes: 2, 
            waterCoolingTime:8000, 
            products:{
                perfect:[{id:2,cnt:4}],
                good:[{id:2,cnt:4}],
                normal:[{id:2,cnt:4}],
            },
        },
    ]
    export let configProduct:ProductConfig[] = [
        {id:1, name:"胡萝卜", price:1},
        {id:2, name:"花朵", price:4},
        {id:3, name:"粉萝卜", price:6},
        {id:4, name:"红萝卜", price:8},
        {id:5, name:"紫萝卜", price:1},
    ];
    export let configProp:PropConfig[] = [
        {id:1, name:"铁锹", type:Type.Spade},
        {id:2, name:"堆肥", type:Type.Shit},
        {id:3, name:"洒水器", type:Type.Sprinkler},
        {id:4, name:"稻草人", type:Type.Scarecrow},
        {id:5, name:"留声机", type:Type.Phonograph},
    ];
    export let configWeapons:WeaponConfig[] = [
        {
            type:WeaponType.Carrot,
            iconUrl:`Atlas/Icon/Weapon/Carrot`,
            lvlConfs:[
                {lvl:1, ROF:4, speed:600, prefabPath:"Scene/FightScene/Bullet/Carrot/Carrot"},
                {lvl:2, ROF:6, speed:600, prefabPath:"Scene/FightScene/Bullet/Carrot/Carrot"},
                {lvl:3, ROF:8, speed:600, prefabPath:"Scene/FightScene/Bullet/Carrot/Carrot"},
            ]
        },
        {
            type:WeaponType.Banana,
            iconUrl:`Atlas/Icon/Weapon/Banana`,
            lvlConfs:[
                {lvl:1, ROF:4, speed:600, prefabPath:"Scene/FightScene/Bullet/Carrot/Carrot"},
                {lvl:2, ROF:6, speed:600, prefabPath:"Scene/FightScene/Bullet/Carrot/Carrot"},
                {lvl:3, ROF:8, speed:600, prefabPath:"Scene/FightScene/Bullet/Carrot/Carrot"},
            ]
        },
        {
            type:WeaponType.Egg,
            iconUrl:`Atlas/Icon/Weapon/Egg`,
            lvlConfs:[]
        },
        {
            type:WeaponType.Grape,
            iconUrl:`Atlas/Icon/Weapon/Grape`,
            lvlConfs:[]
        },
        {
            type:WeaponType.HamiMelon,
            iconUrl:`Atlas/Icon/Weapon/HamiMelon`,
            lvlConfs:[]
        },
        {
            type:WeaponType.Lemon,
            iconUrl:`Atlas/Icon/Weapon/Lemon`,
            lvlConfs:[]
        },
        {
            type:WeaponType.Pineapple,
            iconUrl:`Atlas/Icon/Weapon/Pineapple`,
            lvlConfs:[]
        },
        {
            type:WeaponType.Strawberry,
            iconUrl:`Atlas/Icon/Weapon/Strawberry`,
            lvlConfs:[]
        },
        {
            type:WeaponType.Tomato,
            iconUrl:`Atlas/Icon/Weapon/Tomato`,
            lvlConfs:[]
        },
    ]
    export let configWall = [
        { hpMax:0 },
        { hpMax:1 },
        { hpMax:2 },
        { hpMax:3 },
        { hpMax:4 },
        { hpMax:5 },
        { hpMax:6 },
        { hpMax:7 },
        { hpMax:8 },
        { hpMax:9 },
        { hpMax:10 },
        { hpMax:11 },
        { hpMax:12 },
        { hpMax:13 },
        { hpMax:14 },
        { hpMax:15 },
    ]
    export function load(){
        /**读取配置 */
        DB.Set("config/townShops", townShops);
        DB.Set("config/seedShopGoods", configGoods);
        DB.Set("config/seed", configSeed);
        DB.Set("config/plant", configPlant);
        DB.Set("config/product", configProduct);
    } 
    export function GoodsConfById(id){
        return configGoods.find((conf)=>{
            return conf.id == id;
        }); 
    }
    export function SeedConfById(id){
        return configSeed.find((conf)=>{
            return conf.id == id;
        }); 
    }
    export function PlantConfById(id){
        return configPlant.find((conf)=>{
            return conf.id == id;
        }); 
    }
    export function ProductConfById(id){
        return configProduct.find((conf)=>{
            return conf.id == id;
        }); 
    }
    export function PropConfById(id){
        return configProp.find((conf)=>{
            return conf.id == id;
        }); 
    }
    export function WeaponLvlConfByTypeLvl(type, lvl){
        let weaponConf = WeaponConfByType(type);
        if(weaponConf){
            let lvlConfs = weaponConf.lvlConfs;
            for(let j=0; j<lvlConfs.length; j++){
                let lvlConf = lvlConfs[j];
                if(lvlConf.lvl == lvl){
                    return lvlConf;
                }
            } 
        }
        return null;
    }
    export function WeaponConfByType(type){
        for(let i=0; i<configWeapons.length; i++){
            let weaponConf = configWeapons[i];
            if(weaponConf.type == type){
                return weaponConf;
            }
        }
        return null;
    }
}
