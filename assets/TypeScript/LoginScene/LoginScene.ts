import Scene from "../CocosFrame/Scene";
import SceneManager from "../CocosFrame/SceneManager";
import { DB } from "../CocosFrame/DataBind";
import { Util } from "../CocosFrame/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends Scene {

    @property(cc.Label)
    label: cc.Label = null;
    onLoad () {
        let urls = [
            "Conf/Level",
        ];
        cc.loader.loadResArray(urls, (completedCount, totalCount, item)=>{
            //progressCallback
            this.label.string = `加载配置(${completedCount}/${totalCount})`;
        }, ()=>{
            //completeCallback
            SceneManager.ins.Enter("MenuScene");
        });
    }
}
