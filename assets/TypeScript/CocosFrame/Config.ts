
export namespace Config{

    export function getlvlConf(lvl:number){
        let conf = cc.loader.getRes("Conf/Level");
        return conf.json[lvl];
    }
}
