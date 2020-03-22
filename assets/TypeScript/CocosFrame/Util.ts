export namespace Util{
    let loadingCache = new Map<string, Promise<any>>();
    export function instantPrefab(path:string){
        return new Promise<cc.Node>((resolve, reject)=>{
            let loadResPromise = null;
            if(loadingCache.has(path)){
                loadResPromise = loadingCache.get(path);
            }else{
                loadResPromise = loadRes(path);
                loadingCache.set(path, loadResPromise);
            }
            loadResPromise.then((prefab:cc.Node) => {
                loadingCache.delete(path);
                let node:cc.Node = cc.instantiate(prefab);
                node.name = path.substr(path.lastIndexOf("/")+1);
                node.position = cc.Vec2.ZERO;
                resolve(node);
            }).catch(reject);
        });
    }
    export function loadRes(path:string){
        return new Promise((resolve, reject)=>{
            cc.loader.loadRes(path, cc.Prefab, (err, prefab) => {
                if (err) {
                    cc.error(err.message || err);
                    reject(prefab);
                }else{
                    resolve(prefab);
                }
            });
        })
    }
    export function enableAllCollider(node:cc.Node){
        let cols = node.getComponents(cc.Collider);
        for(let i=0;i<cols.length;i++){
            cols[i].enabled = true;
        }
    }
    export function disableAllCollider(node:cc.Node){
        let cols = node.getComponents(cc.Collider);
        for(let i=0;i<cols.length;i++){
            cols[i].enabled = false;
        }
    }
    export function getTimeStamp(){
        var date = new Date();
        return date.getTime();
    }
    export function newCustomEvent(type, bubbles = false, detail = null){
        let evt = new cc.Event.EventCustom(type, bubbles);
        evt.detail = detail;
        return evt;
    }
    export function radian(vec2:cc.Vec2){
        let radian = vec2.angle(cc.Vec2.RIGHT);
        if(vec2.y < 0){
            radian = 2*Math.PI - radian;
        }
        return radian;
    }
    export function angle(vec2:cc.Vec2){
        return radian(vec2)*180/Math.PI;
    }
    export function radToVec2(rad){
        return cc.v2(Math.cos(rad), Math.sin(rad));
    }
    export function setAnchor(node:cc.Node, anchorX, anchorY){
        let dx = (anchorX - node.anchorX) * node.width;
        let dy = (anchorY - node.anchorY) * node.height;
        node.x += dx;
        node.y += dy;
        for(let i=0;i<node.childrenCount;i++){
            let child = node.children[i];
            child.x-=dx;
            child.y-=dy;
        }
        node.anchorX = anchorX;
        node.anchorY = anchorY;
    }
    export function randomIdx(len){
        return Math.floor(Math.random()*len);
    }
    export function randomInt(min, max){
        return Math.round(Math.random()*(max-min))+min;
    }
    export function random(min, max){
        return Math.round(Math.random()*(max-min))+min;
    }

    export function lerp(cur, tar, ratio){
        return (tar-cur)*ratio+cur;
    }
    export function clamp(value, min, max){
        return Math.min(Math.max(value, min), max);
    }
    export function move(cur, tar, step){
        if(Math.abs(tar-cur) > step){
            if(cur < tar){
                return cur + step;
            }else{
                return cur - step;
            }
        }else{
            return tar;
        }    
    }
    export function lerpVec2(cur:cc.Vec2, tar:cc.Vec2, ratio:number){
        let x = this.lerp(cur.x, tar.x, ratio);
        let y = this.lerp(cur.y, tar.y, ratio);
        return cc.v2(x,y);
    }
    export function moveVec2(cur:cc.Vec2, tar:cc.Vec2, step:number){
        let dir = tar.sub(cur);
        if(dir.magSqr() > step*step){
            dir.normalize(dir);
            dir.mulSelf(step);
            return dir.addSelf(cur);
        }else{
            return tar;
        }
    }
    let uuid = 0;
    export function newUuid(){
        return uuid++;
    }
    //计算nodeA相对nodeB的相对坐标。即如果把NodeA放到NodeB下，返回NodeA的坐标
    export function convertPosition(nodeA:cc.Node, nodeB:cc.Node){
        let res = cc.v2();
        nodeA.convertToWorldSpaceAR(cc.Vec2.ZERO, res);
        nodeB.convertToNodeSpaceAR(res, res);
        return res;
    }
    //移动node到一个新的节点下，并保持位置不变
    export function moveNode(node:cc.Node, parent:cc.Node){
        let res = cc.v2();
        node.convertToWorldSpaceAR(cc.Vec2.ZERO, res);
        parent.convertToNodeSpaceAR(res, res);
        if(node.parent){
            node.removeFromParent();
        }
        parent.addChild(node);
        node.position = res;
    }
}