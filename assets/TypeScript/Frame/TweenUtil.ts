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
    export function applyBounce(node:cc.Node, oriScale, tarScale, callback = null){
        if(!node){
            return;
        }
        node.scale = oriScale
        cc.tween(node)
            .to(0.1, {scale: tarScale}, { easing: 'backIn'})
            .call(()=>{
                if(callback)callback();
            })
            .to(0.2, {scale: oriScale}, { easing: 'backOut'})
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
}