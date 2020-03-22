import { Util } from "./Util";

export namespace AudioManager  {
    let soundMap = new Map<string,cc.AudioClip>();
    export function playSound(name:string){
        let clip = soundMap.get(name);
        if(clip){
            cc.audioEngine.play(clip, false, 1);
        }else{
            cc.loader.loadRes("Sound/"+name, cc.AudioClip, (err, clip)=>{
                soundMap.set(name, clip);
                cc.audioEngine.play(clip, false, 1);
            });
        }
    }
}
