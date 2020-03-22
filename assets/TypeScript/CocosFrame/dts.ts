
export enum Ease{
    quintOut = 'quintOut',
    quintIn = 'quintIn',
    cubicOut = 'cubicOut',
    cubicIn = 'cubicIn',

}

export declare class LvlConf{
    virusList:VirusInitData[];
}
export declare class VirusInitData{
    t:number;
    v:number;
    x:number;
    y:number;
    vx:number;
    vy:number
};

export declare class RankData{
    rank:number;
    time:number;
};
export declare class DramaData{
    hero:{
        url:string;
    };
    monsters:{url:string}[];
}

export class Platform{
    onShow(callback){

    }
    onHide(callback){}
    shareAppMessage(obj:{title?: string, imageUrl?:string, query?:string, imageUrlId?:string}){}
    setStorage(obj:{key:string, data:string}){}
    setStorageSync(key:string, value:string){}
    getStorage(key:string, succ:(res)=>void){}
    getStorageSync(key:string):any{

    }
    createCanvas(){
        return {
            getContext(type:string){
                return {
                    createImageData(w,h){
                        return {
                            data:[]
                        };
                    }
                    ,
                    putImageData(imageData:{data:number[]},x,y){

                    }
                }
            },
            toTempFilePath(obj:{
                x?: number,
                y?: number,
                width?: number,
                height?: number,
                destWidth?: number,
                destHeight?: number,
                success: (res:{tempFilePath:string}) => {}
            }){},
            toTempFilePathSync(obj:{
                x?: number,
                y?: number,
                width?: number,
                height?: number,
                destWidth?: number,
                destHeight?: number
            }){
                return "#tempFilePath#";
            }

        };
    }
    createImage(){
        return null;
    }
    getOpenDataContext(){
        return {
            postMessage(message){}
        };
    }
}
export let crossPlatform:Platform = new Platform();

let wx = window["wx"];
let tt = window["tt"];

if(wx){
    crossPlatform = wx;
}else if(tt){
    crossPlatform = tt;
}
