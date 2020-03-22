import Scene from "../CocosFrame/Scene";
import SceneManager from "../CocosFrame/SceneManager";
import Panda from "./Panda";
import { Util } from "../CocosFrame/Util";
import VirusFactory from "./VirusFactory";
import { Config } from "../CocosFrame/Config";
import Panel from "../CocosFrame/Panel";
import MessageBox from "../CocosFrame/MessageBox";
import PropFactory from "./PropFactory";
import PausePanel from "../Panel/PausePanel";
import GameOverPanel from "../Panel/GameOverPanel/GameOverPanel";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu('场景/PlayScene') 
export default class PlayScene extends Scene {
    @property(cc.Button)
    pauseBtn: cc.Button = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    touchNode: cc.Node = null;

    @property(Panda)
    panda: Panda = null;

    @property(VirusFactory)
    virusFactory: VirusFactory = null;


    @property(PropFactory)
    propFactory: PropFactory = null;

    private time = 0;
    private playing = false;
    private targetPos:cc.Vec2 = cc.Vec2.ZERO;
    private sensitivity = 1;
    onLoad () {
        cc.director.getCollisionManager().enabled = true; //开启碰撞检测，默认为关闭
        cc.director.getCollisionManager().enabledDebugDraw = true; //开启碰撞检测范围的绘制
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true; //开启碰撞组件的包围盒绘制
        this.pauseBtn.node.on("click", this.onPauseBtnTap, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on("gameOver", this.onGameOver, this);
        this.Bind("option/sensitivity", (sensitivity)=>{
            this.sensitivity = sensitivity;
        });
        this.restart();
    }
    onDestroy(){
        this.touchNode.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    onPauseBtnTap(){
        this.pause();
        this.OpenPanelByName("PausePanel",(pausePanel:PausePanel)=>{
            pausePanel.closeCallback = ()=>{
                this.resume();
            }
            pausePanel.backHomeCallback = ()=>{
                this.savelyExit();
            }
        });
    }
    //scene.active = false时，会引起virusFactory的collider禁用，进而引起子节点被回收到对象池,引起报错
    //所以需要安全的推出，先回收进对象池，再延迟一帧退出Scene
    savelyExit(){
        this.virusFactory.clear();
        this.scheduleOnce(()=>{
            SceneManager.ins.goHome();
        },0);
    }
    onGameOver(){
        if(!this.playing){
            return;
        }
        this.pause();
        this.OpenPanelByName("GameOverPanel",(gameOverPanel:GameOverPanel)=>{
            gameOverPanel.setData({
                time:Util.fixedNum(this.time, 2)
            });
        });
    }
    private onTouchMove(event:cc.Event.EventTouch){
        if(this.playing){
            this.targetPos.addSelf(event.getDelta().mul(this.sensitivity));
        }
    }
    update(dt){
        if(this.playing){
            this.time += dt;
            this.timeLabel.string = Util.getTimeStr(this.time);
            let pos = Util.lerpVec2(this.panda.node.position, this.targetPos, 20*dt);
            let dx = pos.x - this.panda.node.x;
            if(dx > 0){
                this.panda.flipX(1);
            }else if(dx<0){
                this.panda.flipX(-1);
            }
            this.panda.node.position = pos;
        }
    }
    restart(){
        this.time = 0;
        this.virusFactory.clear();
        this.virusFactory.playConf(Config.getlvlConf(1));
        this.propFactory.clear();
        this.propFactory.begin();
        this.playing = true;
        this.panda.reset();
        this.panda.node.position = this.targetPos = cc.Vec2.ZERO;
    }
    pause(){
        this.playing = false;
        this.virusFactory.pause();
        this.propFactory.pause();
    }
    resume(){
        this.playing = true;
        this.virusFactory.resume();
        this.propFactory.resume();
    }
}
