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
@ccclass
export default class PanelManager extends cc.Component {
    static ins:PanelManager = null;
    @property(cc.BlockInputEvents)
    private blockInput:cc.BlockInputEvents = null;
    
    onLoad(){
        PanelManager.ins = this;
        this.blockInput.node.active = false;
    }
    public Open(panelName:string, callback){
        this.OpenByPath("Panel/"+panelName, callback);
    }

    public OpenByPath(path:string, callback){
        cc.loader.loadRes(path, (err, prefab) => {
            var newNode:cc.Node = cc.instantiate(prefab);
            newNode.name = path.substr(path.lastIndexOf("/")+1);
            newNode.position = cc.Vec2.ZERO;
            let panel = newNode.getComponent(Panel);
            if(panel){
                this.blockInput.node.active = true;
                callback(panel);
                this.node.addChild(panel.node, this.node.childrenCount-1);
            }else{
                console.log("PanelManager: cannot find panel component on node : " + path);
            }
        });
    }
    public Close(panel:Panel){
        this.node.removeChild(panel.node);
        this.blockInput.node.active = false;
    }
}
