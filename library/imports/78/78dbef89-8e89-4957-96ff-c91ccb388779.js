"use strict";
cc._RF.push(module, '78dbe+JjolJV5b/yRzLOId5', 'DataBind');
// TypeScript/Frame/DataBind.ts

Object.defineProperty(exports, "__esModule", { value: true });
var DB;
(function (DB) {
    var Data = /** @class */ (function () {
        function Data() {
            this.value = null;
            this.listeners = [];
        }
        //以value为参数，触发监听该数据的所有监听器
        //saveMode : 安全模式，开启时，将会把所有监听器拷贝到临时数组，再依次触发，
        //            避免在其中某个监听器中Bind或UnBind改变listeners数组数量，导致数组串位。
        Data.prototype.Invoke = function (saveMode) {
            var temp;
            var len = this.listeners.length;
            if (saveMode) {
                temp = [];
                for (var i = 0; i < len; i++) {
                    temp.push(this.listeners[i]);
                }
            }
            else {
                temp = this.listeners;
            }
            for (var i = 0; i < len; i++) {
                temp[i](this.value);
            }
        };
        return Data;
    }());
    DB.Data = Data;
    var map = new Map();
    //向指定key增加一个监听器
    function Bind(key, listener) {
        var data = map.get(key);
        if (!data) {
            data = new Data();
            map.set(key, data);
        }
        if (data.listeners.indexOf(listener) <= 0) {
            data.listeners.push(listener);
        }
        listener(data.value);
    }
    DB.Bind = Bind;
    //绑定服务端数据
    function BindRemote(key, listener) {
        Bind(key, listener);
        // Server.Get(key, (data)=>{
        //     Set(key, data);
        // },()=>{
        // });
    }
    DB.BindRemote = BindRemote;
    //取消绑定一个监听器
    function UnBind(key, listener) {
        var data = map.get(key);
        if (data) {
            var index = data.listeners.indexOf(listener);
            if (index <= 0) {
                data.listeners.splice(index, 1);
            }
        }
    }
    DB.UnBind = UnBind;
    //设置数据的值，如果数据改变，则触发监听该数据的所有监听器
    function Set(key, value, saveMode) {
        if (saveMode === void 0) { saveMode = false; }
        var data = map.get(key);
        if (!data) {
            data = new Data();
            data.value = value;
            map.set(key, data);
        }
        else {
            if (value !== data.value) {
                data.value = value;
                data.Invoke(saveMode);
            }
        }
    }
    DB.Set = Set;
    function Get(key) {
        var data = map.get(key);
        if (data) {
            return data.value;
        }
        else
            return null;
    }
    DB.Get = Get;
    //触发监听该数据的所有监听器
    function Invoke(key, saveMode) {
        if (saveMode === void 0) { saveMode = false; }
        var data = map.get(key);
        if (data) {
            data.Invoke(saveMode);
        }
    }
    DB.Invoke = Invoke;
    var DataBindComponent = /** @class */ (function (_super) {
        __extends(DataBindComponent, _super);
        function DataBindComponent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.map = new Map();
            return _this;
        }
        DataBindComponent.prototype.Bind = function (key, listener) {
            var tempListener = listener.bind(this);
            this.map.set(key, tempListener);
            DB.Bind(key, tempListener);
        };
        DataBindComponent.prototype.UnBind = function (key) {
            var listener = this.map.get(key);
            if (listener) {
                this.map.delete(key);
                DB.UnBind(key, listener);
            }
        };
        DataBindComponent.prototype.onDestroy = function () {
            this.map.forEach(function (v, k) {
                DB.UnBind(k, v);
            });
        };
        return DataBindComponent;
    }(cc.Component));
    DB.DataBindComponent = DataBindComponent;
    var Event;
    (function (Event) {
    })(Event = DB.Event || (DB.Event = {}));
})(DB = exports.DB || (exports.DB = {}));

cc._RF.pop();