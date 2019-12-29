import { Util } from "./Util";

export namespace PoolManager{
    ///对象池
    class Pool{
        prefab: cc.Node = null;
        list:cc.Node[] = [];
        public loadPrefab(prefabPath:string){
            return Util.instantPrefab(prefabPath).then((node:cc.Node)=>{
                this.prefab = node;
            })
        }
        public getInstance():cc.Node{
            if(this.list.length > 0){
                return this.list.pop();
            }else{
                var node:cc.Node = cc.instantiate(this.prefab);
                node.name = this.prefab.name;
                node.position = cc.Vec2.ZERO;
                return node;
            }
        }
        public returnInstance(node:cc.Node){
            this.list.push(node);
        }
    }
    ///池的工厂
    let poolMap = new Map<string, Pool>();
    export function getInstance(prefabPath:string){
        let pool = poolMap.get(prefabPath);
        if(!pool){
            cc.error(`找不到对象池${prefabPath},对象池必须先preload`);
            return null;
        }
        let node = pool.getInstance();
        node.name = prefabPath.replace(/\//g,"_");
        return node;
    }
    export function returnInstance(node:cc.Node){
        let prefabPath = node.name.replace(/_/g,"/");
        let pool = poolMap.get(prefabPath);
        if(pool){
            pool.returnInstance(node);
        }
    }
    export function preload(paths:string[]){
        let list = [];
        for(let i=0; i<paths.length; i++){
            let pool = new Pool();
            poolMap.set(paths[i], pool);
            list.push(pool.loadPrefab(paths[i]));
        }
        return Promise.all(list);
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
}