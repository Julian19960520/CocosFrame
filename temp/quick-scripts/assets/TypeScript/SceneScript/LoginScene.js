(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/TypeScript/SceneScript/LoginScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a0666j/7C9OXopkDrpJx/m3', 'LoginScene', __filename);
// TypeScript/SceneScript/LoginScene.ts

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
var LoginScene = /** @class */ (function (_super) {
    __extends(LoginScene, _super);
    function LoginScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.text = 'hello';
        _this.button = null;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    LoginScene.prototype.onLoad = function () {
        this.button.node.on("click", function () {
            SceneSystem_1.default.ins.Enter("MainMenuScene", function (scene) {
                console.log("Enter", scene);
            });
        });
    };
    __decorate([
        property(cc.Label)
    ], LoginScene.prototype, "label", void 0);
    __decorate([
        property
    ], LoginScene.prototype, "text", void 0);
    __decorate([
        property(cc.Button)
    ], LoginScene.prototype, "button", void 0);
    LoginScene = __decorate([
        ccclass
    ], LoginScene);
    return LoginScene;
}(Scene_1.default));
exports.default = LoginScene;

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
        //# sourceMappingURL=LoginScene.js.map
        