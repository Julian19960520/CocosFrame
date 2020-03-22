import { crossPlatform } from "./dts";

export namespace Local {
    let map = new Map<string, any>();
    let dirtyList = [];
    export function Get(key){
        if(map.has(key)){
            return map.get(key);
        }else{
            let value = crossPlatform.getStorageSync(key);
            map.set(key, value);
            return value;
        }
    }
    export function GetAsync(key, callback){
        if(map.has(key)){
            callback(map.get(key));
        }else{
            crossPlatform.getStorage(key,(value)=>{
                map.set(key, value);
                callback(value);
            });
        }
    }
    export function Set(key, value){
        map.set(key, value);
        if(dirtyList.indexOf(key)<0){
            dirtyList.push(key);
        }
    }
    export function Save(){
        for(let i=0;i<dirtyList.length;i++){
            let key = dirtyList[i];
            let data = map.get(key);
            crossPlatform.setStorage({key:key, data:data});
        }
        dirtyList = [];
    }
}
