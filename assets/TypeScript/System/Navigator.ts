
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
import SceneManager from "./SceneManager";
import Scene from "./Scene";
import { DB } from "./DataBind";

@ccclass
export default class Navigator extends DB.DataBindComponent {

    @property(cc.Button)
    buttonBack: cc.Button = null;
    @property(cc.Button)
    buttonHome: cc.Button = null;
    onLoad(){
        this.Bind("curScene",(scene:Scene)=>{
            if(scene){
                this.buttonBack.node.active = scene.showBack;
                this.buttonHome.node.active = scene.showHome;
            }
        })
        this.buttonBack.node.on("click",()=>{
            SceneManager.ins.Back();
        })
        this.buttonHome.node.on("click",()=>{
            SceneManager.ins.goHome();
        })
    }
}
