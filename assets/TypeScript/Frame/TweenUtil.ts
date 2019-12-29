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
}