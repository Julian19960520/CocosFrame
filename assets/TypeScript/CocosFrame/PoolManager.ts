import { Util } from "./Util";
import PoolItem from "./PoolItem";

export namespace PoolManager{
    //对象池Manager
    let poolMap = new Map<string, Pool>();
    export function getInstance(prefabPath:string){
        let pool = poolMap.get(prefabPath);
        if(!pool){
            pool = new Pool(prefabPath);
            poolMap.set(prefabPath, pool);
        }
        let node = pool.getInstance();
        return node;
    }
    export function destroyPool(paths:string[]){
        for(let i=0; i<paths.length; i++){
            poolMap.delete(paths[i]);
        }
    }
    export function printPoolMap(){
        poolMap.forEach((pool, key)=>{
            cc.log("pool:"+key, pool.list.length);
        })
    }



    ///对象池
    export class Pool{
        prefab: cc.Node = null;
        list:cc.Node[] = [];
        constructor(prefabPath){
            this.prefab = cc.loader.getRes(prefabPath);
        }
        public getInstance():cc.Node{
            if(this.list.length > 0){
                let node = this.list.pop();
                return node;
            }else{
                var node:cc.Node = cc.instantiate(this.prefab);
                node.name = this.prefab.name;
                node.position = cc.Vec2.ZERO;
                let poolItem = node.addComponent(PoolItem);
                poolItem.pool = this;
                return node;
            }
        }
        public returnInstance(node:cc.Node){
            if(this.list.indexOf(node) < 0){
                this.list.push(node);
                if(node.parent){
                    node.removeFromParent(false);
                }
            }
        }
    }
}