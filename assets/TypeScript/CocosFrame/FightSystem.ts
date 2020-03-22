import Damager from "./Damager";
import Hper from "./Hper";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export namespace FightSystem{
    export enum Event{
        BeatHper = "BeatHper",  //Damager可以触发：打击Hper
        KillHper = "KillHper",  //Damager可以触发：杀死Hper

        Beaten = "Beaten",      //Hper可以触发：被Damager打击
        Killed = "Killed",      //Hper可以触发：被Damager杀死
        HpChange = "HpChange",  //Hper可以触发：血量变化
        HpMaxChange = "HpMaxChange",  //Hper可以触发：最大血量变化
    }
    export function init(){
        let colMgr = cc.director.getCollisionManager();
        let _doCollide = colMgr["_doCollide"];
        colMgr["_doCollide"] = function (collisionType, contact) {
            _doCollide.call(colMgr, collisionType, contact);
            if(collisionType !== 1){
                return;
            }
            var collider1 = contact.collider1;
            var collider2 = contact.collider2;
            var comps1 = collider1.node._components;
            var comps2 = collider2.node._components;
            var hper1:Hper = null;
            var damager1:Damager = null;
            var hper2:Hper = null;
            var damager2:Damager = null;
            var i, len, comp;
            for (i = 0, len = comps1.length; i < len; i++) {
                comp = comps1[i];
                if (comp instanceof Hper) {
                    hper1 = comp;
                }
                if (comp instanceof Damager) {
                    damager1 = comp;
                }
            }
            for (i = 0, len = comps2.length; i < len; i++) {
                comp = comps2[i];
                if (comp instanceof Hper) {
                    hper2 = comp;
                }
                if (comp instanceof Damager) {
                    damager2 = comp;
                }
            }
            if(hper1 && damager2){
                doFight(damager2, hper1);
            }
            if(hper2 && damager1){
                doFight(damager1, hper2);
            }

        }
    }

    function doFight(damager:Damager,hper:Hper){
        if(hper.Hp<=0){
            return;
        }
        if(damager.remainTimes<=0){
            return;
        }
        hper.Hp -= damager.dmg;
        hper.Hp = Math.max(hper.Hp, 0);
        damager.remainTimes--;

        let beatData = {
            hper:hper,
            damager:damager,
            dmg:damager.dmg,
            isCrit:false,
            causeDeath:hper.Hp <= 0,
        }
        damager.node.emit(Event.BeatHper, beatData);
        hper.node.emit(Event.Beaten, beatData);
        if(hper.Hp <= 0){
            damager.node.emit(Event.KillHper, beatData);
            hper.node.emit(Event.Killed,beatData);
        }

    }

    function applyBoxDamager(){

    }
    function applyCircleDamager(pos:cc.Vec2, R:number, group, dmg:number ){

    }
}