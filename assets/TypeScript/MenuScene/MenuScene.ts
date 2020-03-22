import Scene from "../CocosFrame/Scene";
import SceneManager, { ShiftAnima } from "../CocosFrame/SceneManager";
import LoadingScene from "../LoadingScene/LoadingScene";
import { PrefabPath } from "../CocosFrame/Config";
import { DB } from "../CocosFrame/DataBind";
import StagePoint, { State } from "./StagePoint";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("场景/MenuScene")
export default class MenuScene extends Scene {

    @property(cc.Button)
    playBtn: cc.Button = null;

    @property(cc.Button)
    optionBtn: cc.Button = null;
    @property(cc.Button)
    rankBtn: cc.Button = null;
    @property(cc.Button)
    createBtn: cc.Button = null;
    @property(cc.Button)
    downloadBtn: cc.Button = null;

    @property(StagePoint)
    stagePoint: StagePoint = null;
    @property(cc.Label)
    stageLabel: cc.Label = null;

    onLoad () {
        this.playBtn.node.on("click", this.onPlayBtnTap, this);
        this.createBtn.node.on("click", this.onCreateBtnTap, this);
        this.rankBtn.node.on("click", this.onRankBtnTap, this);
        this.optionBtn.node.on("click", this.onOptionBtnTap, this);
        this.downloadBtn.node.on("click", this.onDownloadBtnTap, this);
        this.initStageProgress();
    }
    onDestroy(){
        this.playBtn.node.off("click", this.onPlayBtnTap, this);
        this.createBtn.node.off("click", this.onCreateBtnTap, this);
        this.rankBtn.node.off("click", this.onRankBtnTap, this);
        this.optionBtn.node.off("click", this.onOptionBtnTap, this);
        this.downloadBtn.node.off("click", this.onDownloadBtnTap, this);
    }
    private initStageProgress(){
        let stage = DB.Get("user/stage");
        this.stageLabel.string = `第${stage}关`;
        let parent = this.stagePoint.node.parent;
        let max = 5;
        for(let i=parent.childrenCount; i<max; i++){
            let node = cc.instantiate(this.stagePoint.node);
            parent.addChild(node);
        }

        let idx = (stage-1) % max;
        for(let i=0; i<parent.childrenCount; i++){
            let point = parent.children[i].getComponent(StagePoint);
            if(i<idx){
                point.setState(State.Passed);
            }else if(i>idx){
                point.setState(State.Lock);
            }else{
                point.setState(State.Current);
            }
        }
    }
    private onPlayBtnTap(){
        SceneManager.ins.Enter("LoadingScene")
            .then((loadingScene:LoadingScene)=>{
                loadingScene.Load([
                    PrefabPath.virus0,
                    PrefabPath.virus1,
                    PrefabPath.virus2,
                    PrefabPath.virus3,
                    PrefabPath.virus4,
                    PrefabPath.virus5,
                    PrefabPath.mask,
                    PrefabPath.glasses,
                    PrefabPath.disinfection,
                ]).then(()=>{
                    SceneManager.ins.Enter("PlayScene");
                });
            });
    }
    private onEmojiBtnTap(){
        this.OpenPanelByName("EmojiPanel");
    }
    private onRankBtnTap(){
        this.OpenPanelByName("RankPanel");
    }
    private onOptionBtnTap(){
        this.OpenPanelByName("OptionPanel");
    }
    private onDrawBtnTap(){
        this.OpenPanelByName("DrawPanel");
    }
    private onDownloadBtnTap(){
        this.OpenPanelByName("DownloadPanel");
    }
    private onCreateBtnTap(){
        this.OpenPanelByName("CreatePanel");
    }
}
