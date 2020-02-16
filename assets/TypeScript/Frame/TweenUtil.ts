import { Util } from "./Util";

export namespace TweenUtil{
    export function applyJump(node:cc.Node){
        if(!node){
            return;
        }
        node.scale = 1;
        cc.tween(node)
            .to(0.05, {scale: 1.2}, { easing: 'quintOut'})
            .to(0.1, {scale: 1}, { easing: 'quintOut'})
            .call(()=>{
        }).start();
    }
    export function applyScaleBounce(node:cc.Node, oriScale, tarScale, onCenter = null, onEnd = null){
        if(!node){
            return;
        }
        node.scale = oriScale
        cc.tween(node)
            .to(0.1, {scale: tarScale}, { easing: 'backIn'})
            .call(()=>{
                if(onCenter)onCenter();
            })
            .to(0.2, {scale: oriScale}, { easing: 'backOut'})
            .call(()=>{
                if(onEnd)onEnd();
            })
            .start();
    }
    export function applyAppear(node:cc.Node, time, callback = null){
        cc.tween(node)
            .to(time, {scale: 1}, { easing: 'backIn'})
            .call(()=>{
                if(callback)callback();
            })
            .start();
    }
    export function applyDisappear(node:cc.Node, time, callback = null){
        cc.tween(node)
            .to(time, {scale: 0}, { easing: 'backIn'})
            .call(()=>{
                if(callback)callback();
            })
            .start();
    }
    export function applyShake(node:cc.Node, callback = null){
        let speed = 200;
        let range = 4;
        let tw = cc.tween(node);
        let oriPos = node.position;
        let lastPos = node.position;
        for(let i=0;i<2;i++){
            let pos = cc.v2(Util.random(-range,range), Util.random(-range,range));
            let mag = lastPos.sub(pos).mag();
            tw.to(mag/speed, {position: pos});
            lastPos = pos;
        }
        let mag = lastPos.sub(oriPos).mag();
        tw.to(mag/speed, {position: oriPos});
        tw.start();
    }
}