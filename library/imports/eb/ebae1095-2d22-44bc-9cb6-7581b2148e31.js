"use strict";
cc._RF.push(module, 'ebae1CVLSJEvJy2dYGyFI4x', 'ScreenRect');
// TypeScript/System/ScreenRect.ts

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ScreenRect = /** @class */ (function (_super) {
    __extends(ScreenRect, _super);
    function ScreenRect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.maxHeight = 1200;
        _this.minHeight = 1000;
        return _this;
    }
    ScreenRect_1 = ScreenRect;
    ScreenRect.prototype.onLoad = function () {
        ScreenRect_1.Ins = this;
        var widget = this.node.getComponent(cc.Widget);
        var winSizePixels = cc.director.getWinSizeInPixels();
        if (winSizePixels.height > this.maxHeight) {
            widget.top = widget.bottom = (winSizePixels.height - this.maxHeight) / 2;
        }
        if (winSizePixels.height < this.minHeight) {
            this.node.scale = winSizePixels.height / this.minHeight;
            this.node.height = this.minHeight;
        }
    };
    var ScreenRect_1;
    ScreenRect.Ins = null;
    __decorate([
        property
    ], ScreenRect.prototype, "maxHeight", void 0);
    __decorate([
        property
    ], ScreenRect.prototype, "minHeight", void 0);
    ScreenRect = ScreenRect_1 = __decorate([
        ccclass
    ], ScreenRect);
    return ScreenRect;
}(cc.Component));
exports.default = ScreenRect;

cc._RF.pop();