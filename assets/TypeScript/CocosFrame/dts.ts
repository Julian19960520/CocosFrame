
export enum Ease{
    quintOut = 'quintOut',
    quintIn = 'quintIn',
    cubicOut = 'cubicOut',
    cubicIn = 'cubicIn',

}


export declare namespace wx{
	function onShow(callback);
    function shareAppMessage(obj:{title?: string, imageUrl?:string, query?:string, imageUrlId?:string});
};


export declare class LvlConf{
    virusList:VirusInitData[];
}
export declare class VirusInitData{
    t:number;
    v:number;
    x:number;
    y:number;
    vx:number;
    vy:number};
}