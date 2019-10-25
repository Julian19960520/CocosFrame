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
import SceneManager from "../System/SceneSystem"
import { DB } from "../System/DataBind";
@ccclass
export default class MainMenuScene extends Scene {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Label)
    energyLabel: cc.Label = null;
    @property(cc.Button)
    buttonBack: cc.Button = null;
    @property(cc.Button)
    buttonAdd: cc.Button = null;
    @property(cc.Button)
    buttonSub: cc.Button = null;
    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onLoad () {
        this.buttonBack.node.on("click",()=>{
            SceneManager.ins.Back();
        })
        this.buttonAdd.node.on("click",()=>{
            DB.Set("energy", DB.Get("energy")+1)
        })
        this.buttonSub.node.on("click",()=>{
            DB.Set("energy", DB.Get("energy")-1)
        })
        this.Bind("energy", (energy)=>{
            this.energyLabel.string = energy;
        });
        DB.Set("energy", 6);
    }

    // update (dt) {}
}
