
export namespace Config{

    export function getlvlConf(lvl:number){
        let conf = cc.loader.getRes("Conf/Level");
        return conf.json[lvl];
    }
}

export enum PrefabPath{
    virus0 = "Prefab/Virus/virus0/virus0",
    virus1 = "Prefab/Virus/virus1/virus1",
    virus2 = "Prefab/Virus/virus2/virus2",
    virus3 = "Prefab/Virus/virus3/virus3",
    virus4 = "Prefab/Virus/virus4/virus4",
    virus5 = "Prefab/Virus/virus5/virus5",
    mask = "Prefab/Prop/mask",
    glasses = "Prefab/Prop/glasses",
    disinfection = "Prefab/Prop/disinfection",
}

