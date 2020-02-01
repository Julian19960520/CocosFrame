import Hper from "../FarmScene/Hper";
import { Util } from "../Frame/Util";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends Hper {

    @property(cc.ProgressBar)
    hpBar: cc.ProgressBar = null;
    @property(cc.Label)
    label: cc.Label = null;
    onLoad () {
        this.node.on("onHpChange",this.onHpChange, this);
        this.node.on("onHpMaxChange",this.onHpChange, this);
        this.node.on("onKilled", this.onKilled, this);
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
