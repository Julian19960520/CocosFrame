import Scene from "../CocosFrame/Scene";
import SceneManager from "../CocosFrame/SceneManager";
import { DB } from "../CocosFrame/DataBind";
import { Util } from "../CocosFrame/Util";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("场景/LoadingScene")
export default class LoadingScene extends Scene {

    @property(cc.Label)
    label: cc.Label = null;
    Load(urls){
        return new Promise((resolve, reject)=>{
            cc.loader.loadResArray(urls, (completedCount, totalCount, item)=>{
                this.label.string = `加载配置(${completedCount}/${totalCount})`;
            }, ()=>{
                //completeCallback
                resolve();
            });
        });
    }
}
