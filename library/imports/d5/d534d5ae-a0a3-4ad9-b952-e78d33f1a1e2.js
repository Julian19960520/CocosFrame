"use strict";
cc._RF.push(module, 'd534dWuoKNK2blS540z8aHi', 'SceneManager');
// TypeScript/Frame/SceneManager.ts

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
var DataBind_1 = require("./DataBind");
var ScreenRect_1 = require("./ScreenRect");
var SceneManager = /** @class */ (function (_super) {
    __extends(SceneManager, _super);
    function SceneManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stack = [];
        _this.curScene = null;
        _this.firstScene = "";
        _this.homeScene = "";
        _this.content = null;
        _this.blockInput = null;
        return _this;
    }
    SceneManager_1 = SceneManager;
    SceneManager.prototype.onLoad = function () {
        SceneManager_1.ins = this;
        this.Enter(this.firstScene, ShiftAnima.simpleShift);
        this.blockInput.node.active = false;
    };
    //进入新场景
    SceneManager.prototype.Enter = function (sceneName, shiftAnima) {
        if (shiftAnima === void 0) { shiftAnima = ShiftAnima.moveLeftShift; }
        this.blockInput.node.active = true;
        this.stack.push(sceneName);
        return this.shiftScene(sceneName, shiftAnima);
    };
    //回到上个场景
    SceneManager.prototype.Back = function (shiftAnima) {
        var _this = this;
        if (shiftAnima === void 0) { shiftAnima = ShiftAnima.moveRightShift; }
        this.blockInput.node.active = true;
        return new Promise(function (resolve, reject) {
            if (_this.stack.length >= 2) {
                _this.stack.pop();
                _this.shiftScene(_this.stack[_this.stack.length - 1], shiftAnima).then(resolve).catch(reject);
            }
            else {
                console.log("前面没有场景了");
                reject();
                _this.blockInput.node.active = false;
            }
        });
    };
    //回到Home场景，并检查返回路径上的场景是否需要销毁
    SceneManager.prototype.goHome = function (shiftAnima) {
        var _this = this;
        if (shiftAnima === void 0) { shiftAnima = ShiftAnima.moveRightShift; }
        this.blockInput.node.active = true;
        return new Promise(function (resolve, reject) {
            if (_this.homeScene == _this.curScene.node.name) {
                resolve(_this.curScene);
                _this.blockInput.node.active = false;
                return;
            }
            //先弹出当前场景，但不销毁
            _this.stack.pop();
            //检查并销毁路径上的场景
            var sceneName;
            while (_this.stack.length > 0
                && (sceneName = _this.stack[_this.stack.length - 1]) != _this.homeScene) {
                _this.stack.pop();
                var sceneNode = _this.content.getChildByName(sceneName);
                if (sceneNode) {
                    var scene = sceneNode.getComponent(Scene_1.default);
                    if (scene && scene.autoDestroy) {
                        _this.content.removeChild(sceneNode);
                    }
                }
            }
            //从当前场景转换到Home场景
            _this.shiftScene(_this.homeScene, shiftAnima).then(resolve).catch(reject);
        });
    };
    //从当前场景转换到目标场景
    SceneManager.prototype.shiftScene = function (targetSceneName, shiftAnima) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadScene(targetSceneName).then(function (newScene) {
                resolve(newScene);
                var oldScene = _this.curScene;
                shiftAnima(_this.curScene, newScene, function () {
                    if (oldScene && oldScene.autoDestroy) {
                        _this.content.removeChild(oldScene.node);
                        oldScene.node.destroy();
                    }
                    _this.printState();
                    _this.blockInput.node.active = false;
                });
                _this.curScene = newScene;
                DataBind_1.DB.Set("curScene", _this.curScene);
            }).catch(function () {
                reject();
                _this.blockInput.node.active = false;
            });
        });
    };
    //获取场景对象，如果有缓存直接使用，没有则新建对象。
    SceneManager.prototype.loadScene = function (sceneName) {
        var _this = this;
        return new Promise(function (reslove, reject) {
            var sceneNode = _this.content.getChildByName(sceneName);
            if (sceneNode) {
                var scene = sceneNode.getComponent(Scene_1.default);
                reslove(scene);
            }
            else {
                cc.loader.loadRes("Scene/" + sceneName + "/" + sceneName, function (err, prefab) {
                    var newNode = cc.instantiate(prefab);
                    newNode.name = sceneName;
                    newNode.position = cc.Vec2.ZERO;
                    newNode.active = false;
                    var scene = newNode.getComponent(Scene_1.default);
                    if (scene) {
                        _this.content.addChild(scene.node, 0);
                        reslove(scene);
                    }
                    else {
                        reject();
                    }
                });
            }
        });
    };
    SceneManager.prototype.printState = function () {
        var str = "==========SceneManager=========\nstack: ";
        for (var i = 0; i < this.stack.length; i++) {
            str += " >> " + this.stack[i];
        }
        str += "\ncache: ";
        for (var i = 0; i < this.content.childrenCount; i++) {
            str += i + ":" + this.content.children[i].name + ",";
        }
        console.log(str);
    };
    var SceneManager_1;
    SceneManager.ins = null;
    __decorate([
        property
    ], SceneManager.prototype, "firstScene", void 0);
    __decorate([
        property
    ], SceneManager.prototype, "homeScene", void 0);
    __decorate([
        property(cc.Node)
    ], SceneManager.prototype, "content", void 0);
    __decorate([
        property(cc.BlockInputEvents)
    ], SceneManager.prototype, "blockInput", void 0);
    SceneManager = SceneManager_1 = __decorate([
        ccclass
    ], SceneManager);
    return SceneManager;
}(cc.Component));
exports.default = SceneManager;
var ShiftAnima;
(function (ShiftAnima) {
    function simpleShift(curScene, newScene, finish) {
        if (curScene) {
            curScene.node.active = false;
            console.log(curScene.name + " false");
        }
        if (newScene) {
            newScene.node.active = true;
            console.log(newScene.name + " true");
        }
        finish();
    }
    ShiftAnima.simpleShift = simpleShift;
    function moveLeftShift(curScene, newScene, finish) {
        if (curScene) {
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, { position: cc.v2(-ScreenRect_1.default.width, 0) }, { easing: 'quintOut' }).call(function () {
                curScene.node.active = false;
            }).start();
        }
        if (newScene) {
            newScene.node.position = cc.v2(ScreenRect_1.default.width, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, { position: cc.v2(0, 0) }, { easing: 'quintOut' }).call(function () {
                finish();
            }).start();
        }
    }
    ShiftAnima.moveLeftShift = moveLeftShift;
    function moveRightShift(curScene, newScene, finish) {
        if (curScene) {
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, { position: cc.v2(ScreenRect_1.default.width, 0) }, { easing: 'quintOut' }).call(function () {
                curScene.node.active = false;
            }).start();
        }
        if (newScene) {
            newScene.node.position = cc.v2(-ScreenRect_1.default.width, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, { position: cc.v2(0, 0) }, { easing: 'quintOut' }).call(function () {
                finish();
            }).start();
        }
    }
    ShiftAnima.moveRightShift = moveRightShift;
    function moveUpShift(curScene, newScene, finish) {
        if (curScene) {
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, { position: cc.v2(0, -ScreenRect_1.default.height) }, { easing: 'quintOut' }).call(function () {
                curScene.node.active = false;
            }).start();
        }
        if (newScene) {
            newScene.node.position = cc.v2(0, ScreenRect_1.default.height);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, { position: cc.v2(0, 0) }, { easing: 'quintOut' }).call(function () {
                finish();
            }).start();
        }
    }
    ShiftAnima.moveUpShift = moveUpShift;
    function moveDownShift(curScene, newScene, finish) {
        if (curScene) {
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, { position: cc.v2(0, ScreenRect_1.default.height) }, { easing: 'quintOut' }).call(function () {
                curScene.node.active = false;
            }).start();
        }
        if (newScene) {
            newScene.node.position = cc.v2(0, -ScreenRect_1.default.height);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, { position: cc.v2(0, 0) }, { easing: 'quintOut' }).call(function () {
                finish();
            }).start();
        }
    }
    ShiftAnima.moveDownShift = moveDownShift;
    function scaleShift(curScene, newScene, finish) {
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
    }
    ShiftAnima.scaleShift = scaleShift;
})(ShiftAnima = exports.ShiftAnima || (exports.ShiftAnima = {}));

cc._RF.pop();