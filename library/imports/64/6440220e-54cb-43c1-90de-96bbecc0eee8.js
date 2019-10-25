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
var SceneSystem_1 = require("../System/SceneSystem");
var DataBind_1 = require("../System/DataBind");
var MainMenuScene = /** @class */ (function (_super) {
    __extends(MainMenuScene, _super);
    function MainMenuScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.energyLabel = null;
        _this.buttonBack = null;
        _this.buttonAdd = null;
        _this.buttonSub = null;
        _this.text = 'hello';
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    MainMenuScene.prototype.onLoad = function () {
        var _this = this;
        this.buttonBack.node.on("click", function () {
            SceneSystem_1.default.ins.Back();
        });
        this.buttonAdd.node.on("click", function () {
            DataBind_1.DB.Set("energy", DataBind_1.DB.Get("energy") + 1);
        });
        this.buttonSub.node.on("click", function () {
            DataBind_1.DB.Set("energy", DataBind_1.DB.Get("energy") - 1);
        });
        this.Bind("energy", function (energy) {
            _this.energyLabel.string = energy;
        });
        DataBind_1.DB.Set("energy", 6);
    };
    __decorate([
        property(cc.Label)
    ], MainMenuScene.prototype, "label", void 0);
    __decorate([
        property(cc.Label)
    ], MainMenuScene.prototype, "energyLabel", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "buttonBack", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "buttonAdd", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "buttonSub", void 0);
    __decorate([
        property
    ], MainMenuScene.prototype, "text", void 0);
    MainMenuScene = __decorate([
        ccclass
    ], MainMenuScene);
    return MainMenuScene;
}(Scene_1.default));
exports.default = MainMenuScene;

cc._RF.pop();