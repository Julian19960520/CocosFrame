const {ccclass, property} = cc._decorator;

export namespace Util{
    export function instantPrefab(path:string, callback){
        cc.loader.loadRes(path, (err, prefab) => {
            console.log("err", err, prefab);
            var node:cc.Node = cc.instantiate(prefab);
            node.name = path.substr(path.lastIndexOf("/")+1);
            node.position = cc.Vec2.ZERO;
            callback(node);
        });
    }

    export function angle(vec2:cc.Vec2){
        let angle = vec2.angle(cc.Vec2.RIGHT);
        if(vec2.y < 0){
            angle = 2*Math.PI - angle;
        }
        return angle;
    }

    export function randomIdx(len){
        return Math.floor(Math.random()*len);
    }

    export function random(min, max){
        return Math.floor(Math.random()*(max-min))+min;
    }
}