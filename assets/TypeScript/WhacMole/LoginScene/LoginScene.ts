import Scene from "../../Frame/Scene";
import SceneManager from "../../Frame/SceneManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends Scene {

    @property(cc.Label)
    label: cc.Label = null;
    onLoad () {
        let count = 0;
        this.schedule(()=>{
            this.label.string = "loading" + ".".repeat(count%3);
            if(count >= 3){
                SceneManager.ins.Enter("WhacMoleScene");
            }
            count++;
         }, 0.2, 3);
    }
}
