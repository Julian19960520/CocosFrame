import { Util } from "../Frame/Util";
import { FarmController } from "./FarmController";
import { TweenUtil } from "../Frame/TweenUtil";
import { PlantItemData } from "./dts";
import { Config } from "./Config";
import Top from "../Frame/Top";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Plant extends cc.Component {
    @property(cc.Sprite)
    private sprite:cc.Sprite = null;
    @property(cc.Label)
    private label:cc.Label = null;
        
    @property(cc.Button)
    waterBtn: cc.Button = null;

    private plantItemData:PlantItemData = null;

    onLoad(){
        this.sprite.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.sprite.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.sprite.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.waterBtn.node.on("click",this.onWaterBtnClick, this);
        this.waterBtn.node.active = false;
    }
    onTouchStart(evt:cc.Event.EventTouch){
        this.scheduleOnce(this.delayFunc,0.5);
    }
    private onTouchEnd(){
        this.unschedule(this.delayFunc);
        Top.ins.hidePlantDetailBox();
        let plantItemData = this.plantItemData;
        let plantConf = Config.PlantConfById(plantItemData.fk);
        if(plantItemData && plantItemData.curState == plantConf.stateCnt){
            //可收获
            TweenUtil.applyDisappear(this.node, 0.1,()=>{
                FarmController.harvestPlant(plantItemData);
            });
        }
    }
    private onTouchCancel(){
        Top.ins.hidePlantDetailBox();
        this.unschedule(this.delayFunc);
    }
    private delayFunc = ()=>{
        Top.ins.showPlantDetailBox(this.plantItemData, cc.Vec2.ZERO);
    }
    private onWaterBtnClick(){
        FarmController.wateringPlant(this.plantItemData);
    }
    onDestroy(){
        this.clearPlantData();
    };
    //根据植物数据显示植物
    public setupPlant(plantItemData:PlantItemData){
        let plantConf = Config.PlantConfById(plantItemData.fk);
        this.plantItemData = plantItemData;
        this.sprite.node.active = true;
        this.label.node.active = true;
        FarmController.bindPlantClock(this.plantItemData, this.clockListener);
        FarmController.bindPlantState(this.plantItemData, this.stateListener);
        FarmController.bindPlantWater(this.plantItemData, this.waterListener);
        if(this.plantItemData.curState != plantConf.stateCnt){
            this.setLabelProgress(Util.getTimeStamp()-plantItemData.startTime, plantConf.duration);
        }
        this.changeState(this.plantItemData.curState, false);
    }
    private clearPlantData(){
        if(this.plantItemData){
            FarmController.unbindPlantClock(this.plantItemData, this.clockListener);
            FarmController.unbindPlantState(this.plantItemData, this.stateListener);
            FarmController.unbindPlantWater(this.plantItemData, this.waterListener);
        }
    }
    private clockListener = (time, duration)=>{
        this.setLabelProgress(time, duration);
    }
    public setLabelProgress(curTime, total){
        this.label.string = `${Math.floor(curTime/1000)}/${Math.floor(total/1000)}`
    }
    private stateListener = (state, isComplete)=>{
        this.changeState(state, true, ()=>{
            if(isComplete){
                this.label.string = "可收获";
                this.waterBtn.node.active = false;
            }
        });
    }
    public changeState(state, playAnim, callback = null){
        let func = ()=>{          
            cc.loader.loadRes(`Atlas/Item/PlantState${this.plantItemData.fk}_${state}`, cc.SpriteFrame, (err, spriteFrame)=>{
                this.sprite.spriteFrame = spriteFrame;
            });
            if(callback) callback();
        }
        if(playAnim){
            TweenUtil.applyBounce(this.sprite.node, 1, 0.6,  func);
        }else{
            func();
        }
    }
    private waterListener = (showWater)=>{
        this.waterBtn.node.active = showWater;
    }
}
