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
export enum State{
    Passed,
    Current,
    Lock,
}
@ccclass
export default class StagePoint extends cc.Component {

    @property(cc.Sprite)
    point: cc.Sprite = null;
    @property(cc.Sprite)
    checkMark: cc.Sprite = null;

    setState(state:State){
        this.point.node.color = cc.Color.WHITE;
        this.node.scale = 1;
        this.checkMark.node.active = false;
        switch(state){
            case State.Passed:
                this.checkMark.node.active = true;
                break;
            case State.Current:
                this.node.scale = 1.3;
                this.point.node.color = cc.color(70, 185, 42);
                break;
            case State.Lock:

                break;
        }
    }
}
