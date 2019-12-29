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
import Panel from "./Panel";
import Scene from "./Scene";
@ccclass
export default class PanelStack extends cc.Component {
    @property(cc.BlockInputEvents)
    private blockInput:cc.BlockInputEvents = null;
    private stack:Panel[] = [];
    public scene:Scene;
    onLoad(){
        this.blockInput.node.active = false;
    }
    public OpenByName(name:string, callback){
        this.OpenByPath(`Panel/${name}`, callback);
    }
    public OpenByPath(path:string, callback){
        cc.loader.loadRes(path, (err, prefab) => {
            var newNode:cc.Node = cc.instantiate(prefab);
            newNode.name = path.substr(path.lastIndexOf("/")+1);
            newNode.position = cc.Vec2.ZERO;
            let panel = newNode.getComponent(Panel);
            if(panel){
                //隐藏上个面板
                if(this.stack.length > 0){
                    let lastPanel = this.stack[this.stack.length-1];
                    lastPanel.close();
                }
                //打开新面板
                panel.panelStack = this;
                this.blockInput.node.active = true;
                this.blockInput.node.setSiblingIndex(this.node.childrenCount-1);
                this.node.addChild(panel.node, this.node.childrenCount-1);
                panel.open();
                this.stack.push(panel);
                callback(panel);
                this.printStack();
            }else{
                console.log("PanelManager: cannot find panel component on node : " + path);
            }
        });
    }
    public PopCurrent(){
        if(this.stack.length>0){
            let panel = this.stack.pop();
            panel.close(()=>{
                this.node.removeChild(panel.node);
                panel.panelStack = null;
            })
        }
        if(this.stack.length>0){
            let lastPanel = this.stack[this.stack.length-1];
            this.blockInput.node.setSiblingIndex(this.node.childrenCount-1);
            lastPanel.node.setSiblingIndex(this.node.childrenCount-1);
            lastPanel.open();
        }else{
            this.blockInput.node.active = false;
        }
        this.printStack();
    }
    public printStack(){
        let str = "PanelStack:"
        for(let i=0; i<this.node.childrenCount; i++){
            str += this.node.children[i].name+" >> ";
        }
        console.log(str);
    }
}
