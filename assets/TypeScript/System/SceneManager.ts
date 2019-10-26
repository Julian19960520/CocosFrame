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
export default class SceneManager extends cc.Component {
    stack:string[] = [];
    cache:Map<string, Scene> = new Map<string, Scene>();
    curScene:Scene = null;
    static ins:SceneManager = null;
    @property
    firstScene:string = "";
    @property(cc.BlockInputEvents)
    blockInput:cc.BlockInputEvents = null;
    onLoad(){
        SceneManager.ins = this;
        this.Enter(this.firstScene, null, ShiftFunc.simpleShift);
        this.blockInput.enabled = false;
    }
    public Enter(sceneName:string, callback:(t:Scene)=>void = null, shiftFunc = ShiftFunc.moveLeftShift){
        this.loadScene(sceneName).then((newScene:Scene)=>{
            this.stack.push(sceneName);
            if(callback){
                callback(newScene);   
            }
            this.blockInput.enabled = true;
            shiftFunc(this.curScene, newScene, ()=>{
                this.blockInput.enabled = false;
            });
            this.curScene = newScene;
            this.printState();
        })
    }
    public Back(callback:(t:Scene)=>void = null, shiftFunc = ShiftFunc.moveRightShift){
        if(this.stack.length>=2){
            this.stack.pop();
            let lastScene = this.stack[this.stack.length-1];
            this.loadScene(lastScene).then((lastScene:Scene)=>{
                if(callback){
                    callback(lastScene);   
                }
                this.blockInput.enabled = true;
                shiftFunc(this.curScene, lastScene, ()=>{
                    this.blockInput.enabled = false;
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
                cc.loader.loadRes("Scene/"+sceneName+"/"+sceneName, (err, prefab) => {
                    var newNode:cc.Node = cc.instantiate(prefab);
                    newNode.name = sceneName;
                    newNode.position = cc.Vec2.ZERO;
                    newNode.active = false;
                    scene = newNode.getComponent(Scene);
                    if(scene){
                        this.node.addChild(scene.node, 0);
                        this.cache.set(sceneName, scene);
                        reslove(scene);
                    }else{
                        reject();
                    }
                });
            }
        });
    }
    private printState(){
        let str = "==========SceneManager=========\nstack: ";
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




namespace ShiftFunc{
    export function simpleShift(curScene:Scene, newScene:Scene, finish){
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
    export function moveLeftShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(-640, 0)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(640, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    export function moveRightShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(640, 0)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(-640, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    export function scaleShift(curScene:Scene, newScene:Scene, finish){
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
}