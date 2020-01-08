"use strict";
cc._RF.push(module, '48d4dPc9QVN3IDOsv2EXYQl', 'Scene');
// TypeScript/Frame/Scene.ts

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
var PanelStack_1 = require("./PanelStack");
var Util_1 = require("./Util");
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.autoDestroy = true;
        _this.showBack = true;
        _this.showHome = true;
        _this.showEnergyBar = true;
        _this.navigatorItem = [];
        _this.panelStack = null;
        return _this;
    }
    //初始化PanelStack
    Scene.prototype.initPanelStack = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.panelStack) {
                resolve(_this.panelStack);
            }
            else {
                Util_1.Util.instantPrefab("Prefab/PanelStack", function (node) {
                    _this.node.addChild(node);
                    _this.panelStack = node.getComponent(PanelStack_1.default);
                    _this.panelStack.scene = _this;
                    resolve(_this.panelStack);
                });
            }
        });
    };
    //打开一个面板，以resource文件夹作为根查找prefab
    Scene.prototype.OpenPanelByName = function (name, callback) {
        var _this = this;
        this.initPanelStack().then(function (panelStack) {
            panelStack.node.setSiblingIndex(_this.node.childrenCount - 1);
            panelStack.OpenByName(name, callback);
        });
    };
    //打开一个面板，以resource文件夹作为根查找prefab
    Scene.prototype.OpenPanelByPath = function (path, callback) {
        var _this = this;
        this.initPanelStack().then(function (panelStack) {
            panelStack.node.setSiblingIndex(_this.node.childrenCount - 1);
            panelStack.OpenByPath(path, callback);
        });
    };
    //弹出栈顶面板
    Scene.prototype.PopPanel = function () {
        if (this.panelStack) {
            this.panelStack.PopCurrent();
        }
    };
    //读取一个prefab，从场景所在文件夹查找prefab
    Scene.prototype.instantPrefab = function (name, callback) {
        Util_1.Util.instantPrefab("Scene/" + this.node.name + "/" + name, callback);
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