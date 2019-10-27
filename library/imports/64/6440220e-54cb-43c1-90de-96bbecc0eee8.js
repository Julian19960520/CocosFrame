"use strict";
cc._RF.push(module, '64402IOVMtDwZDelrvswO7o', 'MainMenuScene');
// TypeScript/SceneScript/MainMenuScene.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Scene_1 = require("../System/Scene");
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var DataBind_1 = require("../System/DataBind");
var Top_1 = require("../System/Top");
var MainMenuScene = /** @class */ (function (_super) {
    __extends(MainMenuScene, _super);
    function MainMenuScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.energyLabel = null;
        _this.buttonAdd = null;
        _this.buttonSub = null;
        _this.buttonPanel = null;
        _this.buttonToast = null;
        return _this;
        // update (dt) {}
    }
    MainMenuScene.prototype.onLoad = function () {
        var _this = this;
        this.buttonAdd.node.on("click", function () {
            DataBind_1.DB.Set("energy", DataBind_1.DB.Get("energy") + 1);
        });
        this.buttonSub.node.on("click", function () {
            DataBind_1.DB.Set("energy", DataBind_1.DB.Get("energy") - 1);
        });
        this.buttonPanel.node.on("click", function () {
            _this.OpenPanel("MessageBox1", function (box) {
                box.cancelButton.node.active = false;
                box.node.name = "box1";
                box.label.string = "第一个Panel";
                box.okButton.node.on("click", function () {
                    _this.OpenPanel("MessageBox1", function (box) {
                        box.node.name = "box2";
                        box.label.string = "第二个Panel";
                        box.cancelButton.node.on("click", function () {
                            console.log("cancel");
                        });
                        box.okButton.node.on("click", function () {
                            console.log("ok");
                        });
                    });
                });
            });
        });
        this.buttonToast.node.on("click", function () {
            Top_1.default.ins.Toast("aasfasfs");
        });
        this.Bind("energy", function (energy) {
            _this.energyLabel.string = energy;
        });
        DataBind_1.DB.Set("energy", 6);
    };
    __decorate([
        property(cc.Label)
    ], MainMenuScene.prototype, "energyLabel", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "buttonAdd", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "buttonSub", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "buttonPanel", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "buttonToast", void 0);
    MainMenuScene = __decorate([
        ccclass
    ], MainMenuScene);
    return MainMenuScene;
}(Scene_1.default));
exports.default = MainMenuScene;

cc._RF.pop();