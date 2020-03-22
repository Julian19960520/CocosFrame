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
import { DB } from "./DataBind";
import ScreenRect from "./ScreenRect";
@ccclass
export default class SceneManager extends cc.Component {
    stack:string[] = [];
    curScene:Scene = null;
    static ins:SceneManager = null;
    @property
    firstScene:string = "";
    @property
    homeScene:string = "";
    @property(cc.Node)
    content:cc.Node = null;
    @property(cc.BlockInputEvents)
    blockInput:cc.BlockInputEvents = null;

    onLoad(){
        SceneManager.ins = this;
        this.Enter(this.firstScene, ShiftAnima.simpleShift);
        this.blockInput.node.active = false;
    }
    //进入新场景
    public Enter(sceneName:string, shiftAnima = ShiftAnima.simpleShift){
        this.blockInput.node.active = true;
        if(sceneName != "LoadingScene"){
            this.stack.push(sceneName);
        }
        return this.shiftScene(sceneName, shiftAnima);
    }
    //回到上个场景
    public Back(shiftAnima = ShiftAnima.simpleShift){
        this.blockInput.node.active = true;
        return new Promise((resolve, reject)=>{
            if(this.stack.length >= 2){
                this.stack.pop();
                this.shiftScene(this.stack[this.stack.length-1], shiftAnima).then(resolve).catch(reject);
            }else{
                console.log("前面没有场景了");
                reject();
                this.blockInput.node.active = false;
            }
        })
    }
    //回到Home场景，并检查返回路径上的场景是否需要销毁
    public goHome(shiftAnima = ShiftAnima.simpleShift){
        this.blockInput.node.active = true;
        return new Promise((resolve, reject)=>{
            if(this.homeScene == this.curScene.node.name){
                resolve(this.curScene)
                this.blockInput.node.active = false;
                return;
            }
            //先弹出当前场景，但不销毁
            this.stack.pop();
            //检查并销毁路径上的场景
            let sceneName;
            while(this.stack.length > 0 
                    && (sceneName = this.stack[this.stack.length-1]) != this.homeScene){
                this.stack.pop();
                let sceneNode = this.content.getChildByName(sceneName);
                if(sceneNode){
                    let scene = sceneNode.getComponent(Scene);
                    if(scene && scene.autoDestroy){
                        this.content.removeChild(sceneNode);
                    }
                }
            }
            //从当前场景转换到Home场景
            this.shiftScene(this.homeScene, shiftAnima).then(resolve).catch(reject);
        })
    }
    //从当前场景转换到目标场景
    private shiftScene(targetSceneName, shiftAnima){
        return new Promise((resolve, reject)=>{
            this.loadScene(targetSceneName).then((newScene:Scene)=>{
                resolve(newScene);
                let oldScene = this.curScene;
                this.curScene = newScene;
                DB.Set("curScene", this.curScene);
                shiftAnima(oldScene, newScene, ()=>{
                    if(oldScene && oldScene.autoDestroy){
                        this.content.removeChild(oldScene.node);
                    }
                    this.printState();
                    this.blockInput.node.active = false;
                });
            }).catch((e)=>{
                cc.error(e);
                reject();
                this.blockInput.node.active = false;
            });
        });
    }
    //获取场景对象，如果有缓存直接使用，没有则新建对象。
    private loadScene(sceneName:string){
        return new Promise((reslove, reject)=>{
            let sceneNode = this.content.getChildByName(sceneName);
            if(sceneNode){
                let scene:Scene = sceneNode.getComponent(Scene);
                reslove(scene);
            }else{
                cc.loader.loadRes("Scene/"+sceneName+"/"+sceneName, (err, prefab) => {
                    if(err){
                        cc.error(err);
                        return;
                    }
                    var newNode:cc.Node = cc.instantiate(prefab);
                    newNode.name = sceneName;
                    newNode.position = cc.Vec2.ZERO;
                    newNode.active = false;
                    let scene = newNode.getComponent(Scene);
                    if(scene){
                        this.content.addChild(scene.node, 0);
                        reslove(scene);
                    }else{
                        reject();
                    }
                });
            }
        });
    }
    //在content种找到场景实例，
    public findScene<T extends Scene>(type: {prototype: T}):T{
        return this.content.getComponentInChildren(type);
    }
    //打开面板
    public OpenPanelByName(name, callback){
        this.curScene.OpenPanelByName(name,callback);
    }
    public OpenPanelByPath(path, callback){
        this.curScene.OpenPanelByPath(path, callback);
    }
    private printState(){
        let str = "\n++++++++++++SceneManager++++++++++++\n+ stack: ";
        for(let i=0; i<this.stack.length; i++){
            str += " >> "+this.stack[i];
        }
        str+="\n+ cache: ";
        for(let i=0;i<this.content.childrenCount;i++){
            str += `${i}:${this.content.children[i].name},`;
        }
        str += "\n++++++++++++++++++++++++++++++++++++\n"
        console.log(str);
    }
}




export namespace ShiftAnima{
    export function simpleShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.active = false;
        }
        if(newScene){
            newScene.node.active = true;
        }
        finish();
    }
    export function moveLeftShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(-ScreenRect.width, 0)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(ScreenRect.width, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    export function moveRightShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(ScreenRect.width, 0)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(-ScreenRect.width, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    export function moveUpShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(0, -ScreenRect.height)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(0, ScreenRect.height);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    export function moveDownShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(0, ScreenRect.height)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(0, -ScreenRect.height);
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