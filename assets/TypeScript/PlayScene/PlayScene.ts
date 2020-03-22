import Scene from "../CocosFrame/Scene";
import SceneManager from "../CocosFrame/SceneManager";
import Panda from "./Panda";
import { Util } from "../CocosFrame/Util";
import VirusFactory from "./VirusFactory";
import { Config } from "../CocosFrame/Config";
import Panel from "../CocosFrame/Panel";
import MessageBox from "../CocosFrame/MessageBox";
import PropFactory from "./PropFactory";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayScene extends Scene {
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
    onLoad () {
        cc.director.getCollisionManager().enabled = true; //开启碰撞检测，默认为关闭
        cc.director.getCollisionManager().enabledDebugDraw = true; //开启碰撞检测范围的绘制
        cc.director.getCollisionManager().enabledDrawBoundingBox = true; //开启碰撞组件的包围盒绘制
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on("gameOver", this.onGameOver, this);
        this.restart();
    }
    onDestroy(){
        this.touchNode.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    onGameOver(){
        if(!this.playing){
            return;
        }
        this.playing = false;
        this.virusFactory.end();
        this.propFactory.end();
        this.OpenPanelByName("MessageBox",(messageBox:MessageBox)=>{
            messageBox.label.string = "游戏结束";
            messageBox.onOk = ()=>{
                this.panelStack.PopCurrent();
                this.restart();
            }
        });
    }
    private onTouchMove(event:cc.Event.EventTouch){
        if(this.playing){
            this.targetPos.addSelf(event.getDelta());
        }
    }
    update(dt){
        if(this.playing){
            this.time += dt;
            this.timeLabel.string = this.getTimeStr(this.time);
            this.panda.node.position = Util.lerpVec2(this.panda.node.position, this.targetPos, 20*dt);
        }
    }
    getTimeStr(time:number){
        let m = Math.floor(time/60);
        let s = Math.floor(time%60);
        let mm = Math.floor((time - Math.floor(time)) * 60);
        let str = "";
        return ("0"+m).substr(-2) + ":" + ("0"+s).substr(-2) + ":" + ("0"+mm).substr(-2);
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
}
