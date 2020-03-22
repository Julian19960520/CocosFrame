import Scene from "../CocosFrame/Scene";
import SceneManager from "../CocosFrame/SceneManager";
import LoadingScene from "../LoadingScene/LoadingScene";
import PlayScene from "../PlayScene/PlayScene";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuScene extends Scene {

    @property(cc.Button)
    playBtn: cc.Button = null;
    onLoad () {
        this.playBtn.node.on("click", this.onPlayBtnTap, this)
    }
    onDestroy(){
        this.playBtn.node.off("click", this.onPlayBtnTap, this)
    }
    private onPlayBtnTap(){
        SceneManager.ins.Enter("LoadingScene").then((loadingScene:LoadingScene)=>{
            loadingScene.LoadEnter("PlayScene", [
                "Prefab/Virus/virus1",
                "Prefab/Virus/virus2",
                "Prefab/Virus/virus3",
                "Prefab/Virus/virus4",
                "Prefab/Virus/virus5",
                "Prefab/Prop/mask",
                "Prefab/Prop/glasses",
            ]).then((playScene:PlayScene)=>{
                
            });
        });
    }
}
