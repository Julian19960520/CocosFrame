// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponItem extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Button)
    unlockBtn: cc.Button = null;
    @property(cc.Button)
    upgradeBtn: cc.Button = null;
    @property(cc.Button)
    switchBtn: cc.Button = null;
    
    data = null;
    onLoad () {
        this.node.on("setData", this.setData, this);
    }
    setData(data){
        this.data = data;
        if(data.lock){
            this.unlockBtn.node.active = true;
            this.upgradeBtn.node.active = false;
            this.switchBtn.node.active = false;
        }else{
            this.unlockBtn.node.active = false;
            this.upgradeBtn.node.active = false;
            this.switchBtn.node.active = true;
        }
    }
}
