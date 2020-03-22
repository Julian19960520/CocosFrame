import Scene from "../CocosFrame/Scene";
import SceneManager from "../CocosFrame/SceneManager";
import { DB } from "../CocosFrame/DataBind";
import { Util } from "../CocosFrame/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingScene extends Scene {

    @property(cc.Label)
    label: cc.Label = null;
    LoadEnter(scene, urls){
        return new Promise((resolve, reject)=>{
            cc.loader.loadResArray(urls, (completedCount, totalCount, item)=>{
                this.label.string = `加载配置(${completedCount}/${totalCount})`;
            }, ()=>{
                //completeCallback
                resolve(SceneManager.ins.Enter(scene));
            });
        });
    }
}
