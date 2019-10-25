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
import Scene from "./Scene";
@ccclass
export default class SceneSystem extends cc.Component {
    stack:string[] = [];
    cache:Map<string, Scene> = new Map<string, Scene>();
    curScene:Scene = null;
    static ins:SceneSystem = null;
    @property
    firstScene:string = "";
    @property(cc.BlockInputEvents)
    block:cc.BlockInputEvents = null;
    onLoad(){
        SceneSystem.ins = this;
        this.Enter(this.firstScene);
        this.block.enabled = false;
    }
    public Enter(sceneName:string, callback:(t:Scene)=>void = null, shiftFunc = this.moveLeftShift){
        this.loadScene(sceneName).then((newScene:Scene)=>{
            this.stack.push(sceneName);
            if(callback){
                callback(newScene);   
            }
            this.block.enabled = true;
            shiftFunc(this.curScene, newScene, ()=>{
                this.block.enabled = false;
            });
            this.curScene = newScene;
            this.printState();
        })
    }
    public Back(callback:(t:Scene)=>void = null, shiftFunc = this.moveRightShift){
        if(this.stack.length>=2){
            this.stack.pop();
            let lastScene = this.stack[this.stack.length-1];
            this.loadScene(lastScene).then((lastScene:Scene)=>{
                if(callback){
                    callback(lastScene);   
                }
                this.block.enabled = true;
                shiftFunc(this.curScene, lastScene, ()=>{
                    this.block.enabled = false;
                });
                this.curScene = lastScene;
                this.printState();
            })
        }else{
            console.log("this.stack.length == 0");
        }
    }
    private loadScene(sceneName:string){
        return new Promise((reslove, reject)=>{
            let scene = this.cache.get(sceneName);
            if(scene){
                reslove(scene);
            }else{
                cc.loader.loadRes("Scene/"+sceneName, (err, prefab) => {
                    var newNode:cc.Node = cc.instantiate(prefab);
                    newNode.name = sceneName;
                    scene = newNode.getComponent(Scene);
                    if(scene){
                        this.node.addChild(scene.node);
                        this.cache.set(sceneName, scene);
                        reslove(scene);
                    }else{
                        reject();
                    }
                });
            }
        });
    }
    private simpleShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.active = false;
            console.log(curScene.name +" false");
        }
        if(newScene){
            newScene.node.active = true;
            console.log(newScene.name +" true");
        }
        finish();
    }
    private moveLeftShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(-750, 0)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(750, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    private moveRightShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(750, 0)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(-750, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    private scaleShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.scale = 1;
            cc.tween(curScene.node).to(1000,{scale:0}).call(()=>{
                curScene.node.active = false;
            });
        }
        if(newScene){
            curScene.node.scale = 0;
            newScene.node.active = true;
            cc.tween(newScene.node).delay(1000).to(1000,{scale:1}).call(()=>{
                finish();
            });
        }
    }
    private printState(){
        let str = "==========SceneSystem=========\nstack: ";
        for(let i=0; i<this.stack.length; i++){
            str += " >> "+this.stack[i];
        }
        str+="\ncache: ";
        this.cache.forEach((v, k)=>{
            str+=v.name+", "
        })
        str+="\ncurrent: " + this.curScene?this.curScene.name:"null";
        console.log(str);
    }
}
