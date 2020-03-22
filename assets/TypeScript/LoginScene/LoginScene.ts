import Scene from "../CocosFrame/Scene";
import SceneManager from "../CocosFrame/SceneManager";
import { DB } from "../CocosFrame/DataBind";
import { Util } from "../CocosFrame/Util";
import { crossPlatform } from "../CocosFrame/dts";
import { Local } from "../CocosFrame/Local";
const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu('场景/LoginScene') 
export default class LoginScene extends Scene {

    @property(cc.Label)
    label: cc.Label = null;
    onLoad () {
        crossPlatform.onHide(()=>{
            Local.Save();
        })
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
        DB.Set("option/sensitivity",1);
        DB.Set("user/emoji1",0);
        DB.Set("user/emoji2",6);
        let stage = Local.Get("user/stage") || 1;
        let energy = Local.Get("user/energy") || 5;
        let dramas = DB.Get("user/dramas") || [];
        DB.Set("user/stage", stage);
        DB.Set("user/energy", energy);
        DB.Set("user/dramas", dramas);
    }
}
