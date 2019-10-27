// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
}