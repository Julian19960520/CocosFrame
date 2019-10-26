// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScreenRect extends cc.Component {
    @property
    public maxHeight: number = 1200;
    @property
    public minHeight: number = 1000;

    public static Ins:ScreenRect = null;
    onLoad() {
        ScreenRect.Ins = this;
        let widget: cc.Widget = this.node.getComponent(cc.Widget);
        let winSizePixels = cc.director.getWinSizeInPixels();
        if (winSizePixels.height > this.maxHeight) {
            widget.top = widget.bottom = (winSizePixels.height - this.maxHeight) / 2;
        }
        if (winSizePixels.height < this.minHeight) {
            this.node.scale = winSizePixels.height / this.minHeight;
            this.node.height = this.minHeight;
        }
    }
}
