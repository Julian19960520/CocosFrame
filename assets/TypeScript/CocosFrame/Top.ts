import { Util } from "./Util";
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
@ccclass
export default class Top extends cc.Component {
    static ins:Top = null;
    onLoad(){
        Top.ins = this;
    }
    public showToast(text:string){
        Util.instantPrefab("TopLayer/Toast").then((toast:cc.Node)=>{
            toast.getComponentInChildren(cc.Label).string = text;
            this.node.addChild(toast);
            toast.opacity = 0;
            cc.tween(toast)
                .to(0.1, {opacity:255} )
                .delay(1.5)
                .to(0.1, {opacity:0} )
                .call(()=>{
                    this.node.removeChild(toast);
                }
            ).start();
        });
    }
    public showFloatLabel(string , parent:cc.Node, offset){
        let pos:any = parent.convertToWorldSpaceAR(offset);
        pos = parent.convertToNodeSpaceAR(pos);
        cc.log(pos);
        let node = new cc.Node();
        let label = node.addComponent(cc.Label);
        parent.addChild(node);
        node.position = pos;
        label.string = string;
        label.fontSize = 25;
        cc.tween(node)
            .to(0.1, {y:node.y+5} )
            .delay(1.5)
            .to(0.1, {y:node.y+20, opacity:0} )
            .call(()=>{
                node.removeFromParent();
            }
        ).start();
        return label;
    }
}
