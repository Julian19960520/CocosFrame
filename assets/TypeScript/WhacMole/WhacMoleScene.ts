import MoleBase from "./Mole/MoleBase";
import Hammer from "./Hammer";
import Scene from "../Frame/Scene";
import ParticleSystem from "../Frame/ParticleSystem";
import { TweenUtil } from "../Frame/TweenUtil";
import { PoolManager } from "../Frame/PoolManager";
import Hole from "./Hole";
import Pool from "../Frame/Pool";
const {ccclass, property} = cc._decorator;

@ccclass
export default class WhacMoleScene extends Scene {

    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Label)
    comboLabel: cc.Label = null;
    @property(cc.Button)
    startBtn: cc.Button = null;
    @property(cc.Button)
    debugBtn: cc.Button = null;
    @property(Hammer)
    hammer: Hammer = null;
    @property(ParticleSystem)
    particleSystem: ParticleSystem = null;

    private audioSource: cc.AudioSource = null;
    private score:number=0;
    private combo:number=0;
    private holes:Hole[] = [];
    private timer = 0;
    private idx = 0;
    private beats = [];
    private conf:{default,beatList:{t,i,d?,j?,h?,hp?,m?}[]} = null;
    private playing:boolean = false;
    onLoad(){
        this.audioSource = this.getComponent(cc.AudioSource);
        this.holes = this.getComponentsInChildren(Hole);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
        
        cc.loader.loadRes('Conf/Level.json', (err, object)=> {
            this.conf = object.json.level1;
        });
        this.startBtn.node.on("click",()=>{
            this.restart();
            // this.holes[0].onBeatStart({m:2})
        }, this)

        this.debugBtn.node.on("click",()=>{
            // this.holes[0].onBeatEnd()
        }, this);
        this.Bind("TapBeat", this.onTapBeat);
        this.Bind("MissBeat", this.onMissBeat);
        PoolManager.preload([
            "Scene/WhacMoleScene/NormalMole/NormalMole",
            "Scene/WhacMoleScene/BucketMole/BucketMole",
            "Scene/WhacMoleScene/KnockStar",
        ]);
    }
    restart(){
        this.playing = true;
        this.audioSource.play();
        this.idx = 0;
        this.timer = 0;
        this.setCombo(0);
        this.setScore(0);
        this.holes.forEach((hole)=>{
            hole.Reset();
        })
    }
    setCombo(combo){
        this.combo = combo;
        if(this.combo >= 2){
            this.comboLabel.string = this.combo.toString();
        }else{
            this.comboLabel.string = "";
        }
    }
    setScore(score){
        this.score = score;
        let str = this.score.toString();
        if(str.length < 4){
            str = "0".repeat(4-str.length) + str;
        }
        this.scoreLabel.string = str;
    }
    onTapBeat(data){
        if(data){
            this.setScore(this.score + data.score);
            this.setCombo(this.combo+1);
            TweenUtil.applyJump(this.scoreLabel.node);
            TweenUtil.applyJump(this.comboLabel.node);
        }
    }
    onMissBeat(data){
        if(data){
            this.setCombo(0);
        }
    }
    onDestroy(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouch, this);
    }
    private onTouch(evt :cc.Event.EventTouch){
        this.hammer.Knock(this.node.convertToNodeSpaceAR(evt.getLocation()));
    }
    update(dt){
        if(!this.playing){
            return;
        }
        this.timer += dt;
        if(this.idx < this.conf.beatList.length){
            let beat = this.conf.beatList[this.idx];
            if(this.timer > beat.t-0.5){
                this.idx++;
                if(beat.j==undefined) beat.j = this.conf.default.j;
                if(beat.hp==undefined) beat.hp = this.conf.default.hp;
                if(beat.m==undefined) beat.m = this.conf.default.m;
                this.holes[beat.i].onBeatStart(beat);
                this.beats.push(beat);
            }
        }else{

        }
        //检查需要隐藏的地鼠
        let endList = [];
        for(let i=0; i<this.beats.length; i++){
            let beat = this.beats[i];
            let d = (beat.d!=undefined) ? beat.d : this.conf.default.d;
            if(this.timer > beat.t+d-0.5){
                endList.push(beat);
            }
        }
        for(let i=0; i<endList.length; i++){
            let beat = endList[i];
            this.beats.splice(this.beats.indexOf(beat), 1);
            let h = (beat.h!=undefined) ? beat.h : this.conf.default.h;
            this.holes[beat.i].onBeatEnd();
        }
    }
}
