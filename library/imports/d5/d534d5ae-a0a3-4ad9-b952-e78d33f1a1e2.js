"use strict";
cc._RF.push(module, 'd534dWuoKNK2blS540z8aHi', 'SceneSystem');
// TypeScript/System/SceneSystem.ts

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
var Scene_1 = require("./Scene");
var SceneSystem = /** @class */ (function (_super) {
    __extends(SceneSystem, _super);
    function SceneSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stack = [];
        _this.cache = new Map();
        _this.curScene = null;
        _this.firstScene = "";
        _this.block = null;
        return _this;
    }
    SceneSystem_1 = SceneSystem;
    SceneSystem.prototype.onLoad = function () {
        SceneSystem_1.ins = this;
        this.Enter(this.firstScene);
        this.block.enabled = false;
    };
    SceneSystem.prototype.Enter = function (sceneName, callback, shiftFunc) {
        var _this = this;
        if (callback === void 0) { callback = null; }
        if (shiftFunc === void 0) { shiftFunc = this.moveLeftShift; }
        this.loadScene(sceneName).then(function (newScene) {
            _this.stack.push(sceneName);
            if (callback) {
                callback(newScene);
            }
            _this.block.enabled = true;
            shiftFunc(_this.curScene, newScene, function () {
                _this.block.enabled = false;
            });
            _this.curScene = newScene;
            _this.printState();
        });
    };
    SceneSystem.prototype.Back = function (callback, shiftFunc) {
        var _this = this;
        if (callback === void 0) { callback = null; }
        if (shiftFunc === void 0) { shiftFunc = this.moveRightShift; }
        if (this.stack.length >= 2) {
            this.stack.pop();
            var lastScene = this.stack[this.stack.length - 1];
            this.loadScene(lastScene).then(function (lastScene) {
                if (callback) {
                    callback(lastScene);
                }
                _this.block.enabled = true;
                shiftFunc(_this.curScene, lastScene, function () {
                    _this.block.enabled = false;
                });
                _this.curScene = lastScene;
                _this.printState();
            });
        }
        else {
            console.log("this.stack.length == 0");
        }
    };
    SceneSystem.prototype.loadScene = function (sceneName) {
        var _this = this;
        return new Promise(function (reslove, reject) {
            var scene = _this.cache.get(sceneName);
            if (scene) {
                reslove(scene);
            }
            else {
                cc.loader.loadRes("Scene/" + sceneName, function (err, prefab) {
                    var newNode = cc.instantiate(prefab);
                    newNode.name = sceneName;
                    scene = newNode.getComponent(Scene_1.default);
                    if (scene) {
                        _this.node.addChild(scene.node);
                        _this.cache.set(sceneName, scene);
                        reslove(scene);
                    }
                    else {
                        reject();
                    }
                });
            }
        });
    };
    SceneSystem.prototype.simpleShift = function (curScene, newScene, finish) {
        if (curScene) {
            curScene.node.active = false;
            console.log(curScene.name + " false");
        }
        if (newScene) {
            newScene.node.active = true;
            console.log(newScene.name + " true");
        }
        finish();
    };
    SceneSystem.prototype.moveLeftShift = function (curScene, newScene, finish) {
        if (curScene) {
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, { position: cc.v2(-750, 0) }, { easing: 'quintOut' }).call(function () {
                curScene.node.active = false;
            }).start();
        }
        if (newScene) {
            newScene.node.position = cc.v2(750, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, { position: cc.v2(0, 0) }, { easing: 'quintOut' }).call(function () {
                finish();
            }).start();
        }
    };
    SceneSystem.prototype.moveRightShift = function (curScene, newScene, finish) {
        if (curScene) {
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, { position: cc.v2(750, 0) }, { easing: 'quintOut' }).call(function () {
                curScene.node.active = false;
            }).start();
        }
        if (newScene) {
            newScene.node.position = cc.v2(-750, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, { position: cc.v2(0, 0) }, { easing: 'quintOut' }).call(function () {
                finish();
            }).start();
        }
    };
    SceneSystem.prototype.scaleShift = function (curScene, newScene, finish) {
        if (curScene) {
            curScene.node.scale = 1;
            cc.tween(curScene.node).to(1000, { scale: 0 }).call(function () {
                curScene.node.active = false;
            });
        }
        if (newScene) {
            curScene.node.scale = 0;
            newScene.node.active = true;
            cc.tween(newScene.node).delay(1000).to(1000, { scale: 1 }).call(function () {
                finish();
            });
        }
    };
    SceneSystem.prototype.printState = function () {
        var str = "==========SceneSystem=========\nstack: ";
        for (var i = 0; i < this.stack.length; i++) {
            str += " >> " + this.stack[i];
        }
        str += "\ncache: ";
        this.cache.forEach(function (v, k) {
            str += v.name + ", ";
        });
        str += "\ncurrent: " + this.curScene ? this.curScene.name : "null";
        console.log(str);
    };
    var SceneSystem_1;
    SceneSystem.ins = null;
    __decorate([
        property
    ], SceneSystem.prototype, "firstScene", void 0);
    __decorate([
        property(cc.BlockInputEvents)
    ], SceneSystem.prototype, "block", void 0);
    SceneSystem = SceneSystem_1 = __decorate([
        ccclass
    ], SceneSystem);
    return SceneSystem;
}(cc.Component));
exports.default = SceneSystem;

cc._RF.pop();