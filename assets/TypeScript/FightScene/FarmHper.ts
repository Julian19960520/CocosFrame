
import { Util } from "../Frame/Util";
import Hper from "../Frame/Hper";
import { FightSystem } from "../Frame/FightSystem";


const {ccclass, property} = cc._decorator;

@ccclass
export default class FarmHper extends Hper {

    @property(cc.ProgressBar)
    hpBar: cc.ProgressBar = null;
    @property(cc.Label)
    label: cc.Label = null;
    onLoad () {
        this.node.on(FightSystem.Event.HpChange,this.onHpChange, this);
        this.node.on(FightSystem.Event.HpMaxChange,this.onHpChange, this);
        this.node.on(FightSystem.Event.Killed, this.onKilled, this);
        this.onHpChange();
    }
    onHpChange(){
        let target = this.hpBar.barSprite.node;
        let oriColor = target.color;
        cc.tween(target)
            .set({color:cc.color(255,255,255)})
            .delay(0.1)
            .set({color:oriColor})
            .start();
        this.hpBar.progress = this.Hp/this.HpMax;
        this.label.string = `${this.Hp}/${this.HpMax}`;
    }
    onKilled(){
        this.node.dispatchEvent(Util.newCustomEvent("GameOver", true, null));
    }
}
