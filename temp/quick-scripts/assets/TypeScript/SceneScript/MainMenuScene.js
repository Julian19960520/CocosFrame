(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/TypeScript/SceneScript/MainMenuScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '64402IOVMtDwZDelrvswO7o', 'MainMenuScene', __filename);
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
var SceneManager_1 = require("../System/SceneManager");
var DataBind_1 = require("../System/DataBind");
var Util_1 = require("../System/Util");
var Moon_1 = require("../Game/Moon");
var MainMenuScene = /** @class */ (function (_super) {
    __extends(MainMenuScene, _super);
    function MainMenuScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.optionButton = null;
        _this.rankButton = null;
        _this.wikiButton = null;
        _this.zoomNode = null;
        _this.startMapNode = null;
        _this.titleNode = null;
        _this.cascadeOpacity = null;
        _this.noOpacity = null;
        _this.zoomOutBtn = null;
        _this.startBtn = null;
        _this.graphics = null;
        _this.lastPos = null;
        _this.starNode = null;
        _this.moonNode = null;
        return _this;
    }
    MainMenuScene.prototype.onLoad = function () {
        var _this = this;
        this.Bind("archives", function (archives) {
            if (!archives && archives.length == 0) {
                return;
            }
            console.log(JSON.stringify(archives));
            _this.instantPrefab("archive", function (prefab) {
                for (var i = 0; i < archives.length; i++) {
                    var archive = archives[i];
                    var newNode = cc.instantiate(prefab);
                    newNode.name = archive.name;
                    newNode.position = cc.v2(archive.x, archive.y);
                    newNode.getComponentInChildren(cc.Animation).play("ZoomIn");
                    newNode.on("click", _this.onClickArchive, _this);
                    _this.cascadeOpacity.addChild(newNode);
                }
            });
            _this.zoomOutBtn.node.getComponentInChildren(cc.Animation).play("ZoomOut");
        });
        this.optionButton.node.on("click", function () {
        });
        this.rankButton.node.on("click", function () {
        });
        this.wikiButton.node.on("click", function () {
        });
        this.zoomOutBtn.node.on("click", function () {
            _this.zoomOut();
        });
        this.startBtn.node.on("click", this.onStartBtnTap, this);
        this.zoomOutBtn.node.active = false;
        this.startBtn.node.active = false;
    };
    MainMenuScene.prototype.onClickArchive = function (e) {
        this.zoomIn(e.target);
    };
    MainMenuScene.prototype.zoomIn = function (node) {
        var _this = this;
        this.cascadeOpacity.pauseSystemEvents(true);
        var pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        pos = this.zoomNode.convertToNodeSpace(pos);
        Util_1.Util.setAnchor(this.zoomNode, pos.x / 640, pos.y / 1136);
        this.lastPos = this.zoomNode.position;
        this.noOpacity.position = cc.Vec2.ZERO;
        cc.tween(this.zoomNode).to(1, { scale: 100, position: cc.Vec2.ZERO }, { easing: 'circIn' }).start();
        cc.tween(this.cascadeOpacity).to(1, { opacity: 0 }).hide().start();
        cc.tween(this.titleNode).to(1, { position: cc.v2(0, 640) }).call(function () {
            _this.zoomOutBtn.node.active = true;
            _this.startBtn.node.active = true;
        }).start();
        this.initStartMap();
        cc.tween(this.startMapNode).show().set({ opacity: 0 }).to(1, { opacity: 255 }).start();
    };
    MainMenuScene.prototype.zoomOut = function () {
        this.cascadeOpacity.resumeSystemEvents(true);
        this.zoomOutBtn.node.active = false;
        this.startBtn.node.active = false;
        cc.tween(this.zoomNode).to(1, { scale: 1, position: this.lastPos }, { easing: 'circOut' }).start();
        cc.tween(this.cascadeOpacity).show().to(1, { opacity: 255 }).start();
        cc.tween(this.titleNode).to(1, { position: cc.v2(0, 300) }).start();
        cc.tween(this.startMapNode).to(1, { opacity: 0 }).hide().start();
    };
    MainMenuScene.prototype.initStartMap = function () {
        var _this = this;
        this.startMapNode.removeAllChildren();
        var starMap = DataBind_1.DB.Get("starMap");
        var stars = starMap.stars;
        var links = starMap.links;
        var curStarId = starMap.curStarId;
        this.instantPrefab("star", function (prefab) {
            var map = new Map();
            for (var i = 0; i < stars.length; i++) {
                var star = stars[i];
                var newNode = cc.instantiate(prefab);
                newNode.position = cc.v2(star.x, star.y);
                newNode.name = "star" + star.id;
                newNode.getComponentInChildren(cc.Label).string = star.id;
                map.set(star.id, newNode);
                _this.startMapNode.addChild(newNode);
                newNode.on("click", _this.onStarTap, _this, false);
            }
            var graphics = _this.startMapNode.getComponent(cc.Graphics);
            graphics.lineWidth = 3;
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                var node0 = map.get(link[0]);
                var node1 = map.get(link[1]);
                graphics.moveTo(node0.position.x, node0.position.y);
                graphics.lineTo(node1.position.x, node1.position.y);
                graphics.stroke();
            }
            _this.instantPrefab("moon", function (prefab) {
                var newNode = cc.instantiate(prefab);
                _this.startMapNode.addChild(newNode);
                _this.moonNode = newNode;
                _this.setStar(map.get(curStarId));
            });
        });
    };
    MainMenuScene.prototype.onStarTap = function (e) {
        this.setStar(e.target);
    };
    MainMenuScene.prototype.setStar = function (starNode) {
        if (this.starNode != starNode) {
            console.log(starNode);
            this.starNode = starNode;
            this.moonNode.position = cc.v2(starNode.position.x + 50, starNode.position.y);
            this.moonNode.getComponent(Moon_1.default).RotatAround(starNode);
            var motion = this.moonNode.getComponent(cc.MotionStreak);
            cc.tween(motion).set({ fadeTime: 0 }).to(1, { fadeTime: 1 }).start();
        }
    };
    MainMenuScene.prototype.onStartBtnTap = function () {
        SceneManager_1.default.ins.Enter("GameScene");
    };
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "optionButton", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "rankButton", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "wikiButton", void 0);
    __decorate([
        property(cc.Node)
    ], MainMenuScene.prototype, "zoomNode", void 0);
    __decorate([
        property(cc.Node)
    ], MainMenuScene.prototype, "startMapNode", void 0);
    __decorate([
        property(cc.Node)
    ], MainMenuScene.prototype, "titleNode", void 0);
    __decorate([
        property(cc.Node)
    ], MainMenuScene.prototype, "cascadeOpacity", void 0);
    __decorate([
        property(cc.Node)
    ], MainMenuScene.prototype, "noOpacity", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "zoomOutBtn", void 0);
    __decorate([
        property(cc.Button)
    ], MainMenuScene.prototype, "startBtn", void 0);
    __decorate([
        property(cc.Graphics)
    ], MainMenuScene.prototype, "graphics", void 0);
    MainMenuScene = __decorate([
        ccclass
    ], MainMenuScene);
    return MainMenuScene;
}(Scene_1.default));
exports.default = MainMenuScene;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=MainMenuScene.js.map
        