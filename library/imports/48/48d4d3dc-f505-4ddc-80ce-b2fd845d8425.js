"use strict";
cc._RF.push(module, '48d4dPc9QVN3IDOsv2EXYQl', 'Scene');
// TypeScript/System/Scene.ts

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
var DataBind_1 = require("./DataBind");
var PanelManager_1 = require("./PanelManager");
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.autoDestroy = true;
        _this.showBack = true;
        _this.showHome = true;
        _this.showEnergyBar = true;
        _this.navigatorItem = [];
        return _this;
    }
    //打开一个面板，从场景所在文件夹查找prefab
    Scene.prototype.OpenPanel = function (panelName, callback) {
        PanelManager_1.default.ins.OpenByPath("Scene/" + this.node.name + "/" + panelName, callback);
    };
    __decorate([
        property
    ], Scene.prototype, "autoDestroy", void 0);
    __decorate([
        property
    ], Scene.prototype, "showBack", void 0);
    __decorate([
        property
    ], Scene.prototype, "showHome", void 0);
    __decorate([
        property
    ], Scene.prototype, "showEnergyBar", void 0);
    Scene = __decorate([
        ccclass
    ], Scene);
    return Scene;
}(DataBind_1.DB.DataBindComponent));
exports.default = Scene;

cc._RF.pop();