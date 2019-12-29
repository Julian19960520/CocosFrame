import { DB } from "./DataBind";

export namespace RedMark{
    let root = {};
    DB.Set("RedMardRoot", root);
    
    export function setValue(path:string, value:boolean){
        let subStr = path.split("/");
        let p = root;
        let nodes = [];
        let nodePaths = [];
        let tempPath = "RedMardRoot";
        for(let i=0; i<subStr.length; i++){
            if(i == subStr.length-1){
                p[subStr[i]] = value;
                for(let j=nodes.length-1; j>=0;j--){
                    DB.Set(nodePaths[j], getBool(nodes[j]));
                }
                return;
            }
            if(p[subStr[i]] === undefined){
                p[subStr[i]] = {};
            }
            p = p[subStr[i]];
            nodes.push(p);

            tempPath += "/"+subStr[i];
            nodePaths.push(tempPath);
        }
    }
    function getBool(obj:Object){
        let keys:string[] = Object.keys(obj);
        for(let i=0;i<keys.length;i++){
            let k = keys[i];
            let v = obj[k];
            if(v.constructor == Object){
                return getBool(v);
            }else{
                if(v){
                    return true;
                }
            }
        }
        return false;
    }
}