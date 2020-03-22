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
import {DB} from "./DataBind";
import PanelStack from "./PanelStack";
import { Util } from "./Util";
@ccclass
export default class Scene extends DB.DataBindComponent {
    @property
    public autoDestroy = true;
    @property
    public showBack:boolean = true;
    @property
    public showHome:boolean = true;
    @property
    public showEnergyBar:boolean = true;
    @property
    public showCoinBar:boolean = false;
    public panelStack:PanelStack = null;

    public onLevelScene(){}
    //初始化PanelStack
    private initPanelStack(){
        return new Promise((resolve, reject)=>{
            if(this.panelStack){
                resolve(this.panelStack)
            }else{
                Util.instantPrefab("Prefab/PanelStack").then((node:cc.Node)=>{
                    this.node.addChild(node);
                    this.panelStack = node.getComponent(PanelStack);
                    this.panelStack.scene = this;
                    resolve(this.panelStack);
                });
            }
        })
    }
    //打开一个面板，以resource文件夹作为根查找prefab
    public OpenPanelByName(name:string, callback = (panel)=>{}){
        this.initPanelStack().then((panelStack:PanelStack)=>{
            panelStack.node.setSiblingIndex(this.node.childrenCount - 1);
            panelStack.OpenByName(name, callback);
        })
    }
    //打开一个面板，以resource文件夹作为根查找prefab
    public OpenPanelByPath(path:string, callback = (panel)=>{}){
        this.initPanelStack().then((panelStack:PanelStack)=>{
            panelStack.node.setSiblingIndex(this.node.childrenCount - 1);
            panelStack.OpenByPath(path, callback);
        })
    }
    //弹出栈顶面板
    public PopPanel(){
        if(this.panelStack){
            this.panelStack.PopCurrent();
        }
    }
    //读取一个prefab，从场景所在文件夹查找prefab
    public instantPrefab(name:string){
        return Util.instantPrefab(`Scene/${this.node.name}/${name}`);
    }
}
