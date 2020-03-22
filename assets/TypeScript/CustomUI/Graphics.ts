// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("自定义UI/Graphics")
export default class Graphics extends cc.Component {
    sprite:cc.Sprite = null;
    renderTexture:cc.RenderTexture = null;
    pixels:Uint8Array = null;
    width = 0;
    height = 0;
    color = cc.Color.BLACK;
    private _lineWidth = 5;
    set lineWidth(value){
        this._lineWidth = Math.floor(value);
    }
    get lineWidth(){
        return this._lineWidth;
    }
    onLoad(){
        let node = new cc.Node();
        node.anchorX = this.node.anchorX;
        node.anchorY = this.node.anchorY;
        node.width = this.node.width;
        node.height = this.node.height;
        this.width = this.node.width;
        this.height = this.node.height;
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame();
        this.node.addChild(node);
        let renderTexture  = new cc.RenderTexture();

        let gl = cc.game["_renderContext"];
        renderTexture.initWithSize(this.node.width, this.node.height, gl.STENCIL_INDEX8);
        let pixels = this._getUint8Array();

        this.sprite = sprite;
        this.renderTexture = renderTexture;
        this.pixels = pixels;
    }

    //画线
    private _drawLine(pos1, pos2, r, color){
        if(pos1.x > pos2.x){
            let t = pos1;
            pos1 = pos2;
            pos2 = t;
        }
        let brush = this._getBrush(r);
        let data:RangeData[] = [];
        let x1 = Math.round(pos1.x);
        let x2 = Math.round(pos2.x);
        let k = (pos2.y-pos1.y)/(pos2.x-pos1.x);
        if( isNaN(k) || k>this.height || k<-this.height){
            let ymin =Math.round(Math.min(pos1.y, pos2.y));
            let ymax =Math.round(Math.max(pos1.y, pos2.y));
            if(ymin>ymax){

            }
            for(let bx=-r; bx<=r; bx++){
                let brushRange = brush[bx];
                let dataRange = {
                    ymin : ymin+brushRange.ymin,
                    ymax : ymax+brushRange.ymax,
                }
                data[x1+bx] = dataRange;
            }
            this.fillRange(data, color);
            return;
        }
        let y = Math.round(pos1.y);
        let d = 0;
        for(let x=x1; x<=x2; x++){
            for(let bx=-r; bx<=r; bx++){
                if(x+bx<0 || x+bx>=this.width){
                    continue;
                }
                let brushRange = brush[bx];
                let dataRange = data[x+bx];
                if(dataRange == null){
                    dataRange = {
                        ymin : y,
                        ymax : y
                    }
                    data[x+bx] = dataRange;
                }
                if(y+brushRange.ymin < dataRange.ymin){
                    dataRange.ymin = y+brushRange.ymin;
                }
                if(y+brushRange.ymax > dataRange.ymax){
                    dataRange.ymax = y+brushRange.ymax;
                }
            }
            d += k;
            while(d>=1){
                d-=1;
                y++;
            }
            while(d<=-1){
                d+=1;
                y--;
            }
        }
        this.fillRange(data, color);
    }
    private _bucketFill(pos:cc.Vec2, color:cc.Color){
        let pixels = this.pixels;
        pos = this._getV2(Math.round(pos.x), Math.round(pos.y));
        let start = this._getStart(pos.x, pos.y);
        let w = this.width;
        let h = this.height;
        let r = color.getR();
        let g = color.getG();
        let b = color.getB();
        let a = color.getA();
        let oriR = pixels[start];
        let oriG = pixels[start+1];
        let oriB = pixels[start+2];
        let oriA = pixels[start+3];
        if(r == oriR && g == oriG && b == oriB && a == oriA){
            return;
        }
        let checkAndPush = (x, y)=>{
            start = this._getStart(x, y);
            if(x>=0 && y>=0 && x<w && y<h){
                if(pixels[start] == oriR
                    && pixels[start+1] == oriG
                    && pixels[start+2] == oriB
                    && pixels[start+3] == oriA){
                        pixels[start] = r;
                        pixels[start+1] = g;
                        pixels[start+2] = b;
                        pixels[start+3] = a;
                        openList.push(this._getV2(x,y));
                }
            }
        }
        let openList = [pos];
        let cnt = w*h;
        while (openList.length > 0&&cnt--) {
            pos = openList.pop();
            checkAndPush(pos.x-1, pos.y);
            checkAndPush(pos.x, pos.y-1);
            checkAndPush(pos.x+1, pos.y);
            checkAndPush(pos.x, pos.y+1);
            this.v2Pool.push(pos);
        }
    }
    private v2Pool = [];
    private _getV2(x, y){
        let v2 = null;
        if(this.v2Pool.length>0){
            v2 = this.v2Pool.pop();
            v2.x = x;
            v2.y = y;
        }else{
            v2 = cc.v2(x,y);
        }
        return v2;
    }
    private uint8ArrayPool = [];
    private _getUint8Array(copyData = null){
        let arr = null;
        if(this.uint8ArrayPool.length>0){
            arr = this.uint8ArrayPool.pop();
        }else{
            arr = new Uint8Array(this.width*this.height*4);
        }
        if(copyData){
            arr.set(copyData);
        }
        return arr;
    }
    private _clear(x, y, w, h){
        let pixels = this.pixels;
        for(let i=x; i<w;i++){
            for(let j=y; j<this.height; j++){
                let start = this._getStart(i,j);
                pixels[start] = 0;
                pixels[start+1] = 0;
                pixels[start+2] = 0;
                pixels[start+3] = 0;
            }
        }
    }
    private _getStart(x, y){
        return ((this.height-y-1)*this.width+x)*4;
    }
    private _getBrush(r){
        let brush:RangeData[] = [];
        for(let x=-r; x<=r; x++){
            let y = Math.sqrt(r*r - x*x);
            y = Math.floor(y);
            brush[x] = {
                ymin : -y,
                ymax : y
            };
        }
        return brush;
    }
    private fillRange(data:RangeData[], color:cc.Color){
        let pixels = this.pixels;
        let w = this.width;
        let h = this.height;
        let r = color.getR();
        let g = color.getG();
        let b = color.getB();
        let a = color.getA();
        data.forEach((range, x)=>{
            for(let y =range.ymin; y<range.ymax; y++){
                let start = this._getStart(x, y);
                pixels[start] = r;
                pixels[start+1] = g;
                pixels[start+2] = b;
                pixels[start+3] = a;
            }
        })
    }
    private updateTexture(){
        let dataView = this.pixels as any;
        this.renderTexture.initWithData(dataView, cc.Texture2D.PixelFormat.RGBA8888, this.width, this.height);
        this.sprite.spriteFrame.setTexture(this.renderTexture);  
    }

    //画线操作
    lineOp = null;
    private lastPos = cc.Vec2.ZERO;

    beginLine(pos:cc.Vec2){
        this.lineOp = {
            type:"line",
            lineWidth : this.lineWidth,
            color : this.color,
            posList:[pos]
        }
        this.lastPos = pos;
        this.updateTexture();
    }

    lineTo(pos){
        if(this.lineOp){
            this.lineOp.posList.push(pos);
        }
        this._drawLine(this.lastPos, pos, this.lineWidth, this.color);
        this.lastPos = pos;
        this.updateTexture();
    }

    endLine(){
        if(this.lineOp){
            this.pushOp(this.lineOp);
            this.lineOp = null;
        }
    }

    //清空操作
    clear(x=0, y=0, w=this.width, h=this.height){
        this._clear(x,y,w,h);
        this.pushOp({
            type:"clear",
            x:x,
            y:y,
            w:w,
            h:h
        });
        this.updateTexture();
    }

    //油漆桶操作
    bucketFill(pos:cc.Vec2, color:cc.Color){
        this.pushOp({
            type:"bucket",
            pos:pos,
            color:color,
        });
        this._bucketFill(pos, color);
        this.updateTexture();
    }
    
    //操作栈
    private opStack = [];
    private pushOp(op){
        //每隔10个操作，保存一个快照
        if(this.opStack.length%3 == 0 && this.opStack.length != 0){
            let snap = new Uint8Array(this.width*this.height*4);
            for(let i=0, len=this.pixels.length; i<len; i++){
                snap[i] = this.pixels[i];
            }
            op.snapshot = snap;
        }    
        this.opStack.push(op);
    }
    private apllyStack(opStack){
        cc.log(opStack);
        //找到最近一次画板快照，
        let start = 0;
        for(let i=opStack.length-1; i>=0; i--){
            let op = opStack[i];
            if(op.snapshot){
                this.pixels = this._getUint8Array(op.snapshot);
                start = i+1;
                break;
            }
        }
        cc.log(`从第${start}开始恢复, ${opStack.length}`);
        //从最近一次快照开始依次执行操作
        for(let i=start; i<opStack.length; i++){
            let op = opStack[i];
            switch(op.type){
                case "line":{
                    let color = op.color;
                    let lineWidth = op.lineWidth;
                    let posList:any[] = op.posList;
                    let lastPos = posList[0];
                    let curPos;
                    for(let i=1;i<posList.length;i++){
                        curPos = posList[i];
                        this._drawLine(lastPos, curPos, lineWidth, color);
                        lastPos = curPos;
                    }
                    break;
                }
                case "bucket":{
                    this._bucketFill(op.pos, op.color);
                    break;
                }
                case "clear":{
                    this._clear(op.x, op.y, op.w, op.h);
                    break;
                }
            }
        }
        this.updateTexture();
    }

    //回滚一个操作
    public revert(){
        this._clear(0,0,this.width, this.height);
        if(this.opStack.length>0){
            this.opStack.pop();
        }
        this.apllyStack(this.opStack);
    }
}

class RangeData{
    ymin:number;
    ymax:number;
}