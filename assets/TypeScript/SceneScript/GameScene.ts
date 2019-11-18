import Scene from "../System/Scene";
import Planet from "../Model/planet";
import { Util } from "../System/Util";
import Moon from "../Model/Moon";
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends Scene {
    @property(Planet)
    public moon:Moon = null;
    private curCenterPlanet:Planet = null;
    private lastCenterPlanet:Planet = null;
    public planets:Planet[] = null;
    public onLoad(){
        this.planets = this.node.getComponentsInChildren(Planet);
        this.planets.splice(this.planets.indexOf(this.moon), 1);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)        
    }
    public onDestroy(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)  
    }
    public start(){
        let planet = this.planets[Util.randomIdx(this.planets.length)];
        this.moon.angle = 0;
        this.moon.node.x = planet.node.x;
        this.moon.node.y = planet.node.y + planet.range * 0.8;
        this.moon.RotatAround(planet.node);
        this.lastCenterPlanet = planet;
    }
    public update(){
        let target = null;
        for(let i=0, len=this.planets.length; i<len; i++){
            let planet = this.planets[i];
            if(planet === this.lastCenterPlanet){
                continue;
            }
            let magSqr = this.moon.node.position.sub(planet.node.position).magSqr();
            if(magSqr < Math.pow(planet.range, 2)){
                target = planet;
                break;
            }
        }
        if(target){
            this.moon.captured(target);
            this.lastCenterPlanet = target;
        }
    }
    private onTouchStart(){
        cc.director.getScheduler().setTimeScale(0.15)
        this.moon.aim();
    }
    private onTouchEnd(){
        cc.director.getScheduler().setTimeScale(1)
        this.moon.launch();
    }
}
