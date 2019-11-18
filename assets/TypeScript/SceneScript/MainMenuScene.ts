import Scene from "../System/Scene";

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
import SceneManager from "../System/SceneManager"
import PanelManager from "../System/PanelManager"
import { DB } from "../System/DataBind";
import MessageBox from "./MessageBox";
import {Util} from "../System/Util";
import Top from "../System/Top";
@ccclass
export default class MainMenuScene extends Scene {
    @property(cc.Label)
    energyLabel: cc.Label = null;
    @property(cc.Button)
    buttonAdd: cc.Button = null;
    @property(cc.Button)
    buttonSub: cc.Button = null;
    @property(cc.Button)
    buttonPanel: cc.Button = null;
    @property(cc.Button)
    buttonToast: cc.Button = null;

    @property(cc.Button)
    buttonStart: cc.Button = null;
    
    onLoad () {
        this.buttonAdd.node.on("click",()=>{
            DB.Set("energy", DB.Get("energy")+1)
        })
        this.buttonSub.node.on("click",()=>{
            DB.Set("energy", DB.Get("energy")-1)
        })
        this.buttonPanel.node.on("click",()=>{
            this.OpenPanel("MessageBox1",(box:MessageBox)=>{
                box.cancelButton.node.active = false;
                box.node.name = "box1"
                box.label.string = "第一个Panel";
                box.okButton.node.on("click", ()=>{
                    this.OpenPanel("MessageBox1",(box:MessageBox)=>{
                        box.node.name = "box2"
                        box.label.string = "第二个Panel";
                        box.cancelButton.node.on("click", ()=>{
                            console.log("cancel");
                        })
                        box.okButton.node.on("click", ()=>{
                            console.log("ok");
                        })
                    });
                })
            });
        })
        this.buttonToast.node.on("click",()=>{
            Top.ins.Toast("aasfasfs");
        })
        this.Bind("energy", (energy)=>{
            this.energyLabel.string = energy;
        });
        DB.Set("energy", 6);
        this.buttonStart.node.on("click",()=>{
            SceneManager.ins.Enter("GameScene");
        })
    }

    // update (dt) {}
}
