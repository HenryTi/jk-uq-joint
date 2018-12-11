import { Mapper } from "./mapper";
import { execSql } from "../db/mysql/tool";
import { createMapTable } from "./createMapTable";
import { getOpenApi } from "./openApi";
import { databaseName } from "../db/mysql/database";
import { map } from "./map";
import { Settings } from "../defines";

abstract class MapData {
    protected settings: Settings;
    constructor(settings: Settings) {
        this.settings = settings;
    }
    protected abstract tuidId(tuid:string, value:any): Promise<string|number>;

    protected async mapProp(prop:string, value:any): Promise<{p:string, val:any}> {
        let pos = prop.indexOf('@');
        if (pos < 0) {
            //body[prop] = value; // data[from];
            return {p:prop, val: value};
        }
        else {
            let v = prop.substr(0, pos);
            let tuid = prop.substr(pos+1);
            //let val = data[from];
            let propId = await this.tuidId(tuid, value);
            //body[v] = propId;
            return {p:v, val: propId};
        }
    }
        
    protected async mapStringProp(prop:string, data:any): Promise<any> {
        let pos = prop.indexOf('@');
        if (pos < 0) {
            //body[prop] = value; // data[from];
            return data[prop];
        }
        else {
            let v = prop.substr(0, pos);
            let tuid = prop.substr(pos+1);
            //let val = data[from];
            let propId = await this.tuidId(tuid, data[v]);
            //body[v] = propId;
            return propId;
        }
    }
        
    async map(data:any, mapper:Mapper):Promise<any> {
        let body:any = {};
        for (let i in mapper) {
            let prop = mapper[i];
            //let value = data[i];
            switch (typeof prop) {
            case 'undefined':
                //body[i] = value;
                break;
            case 'boolean':
                if (prop === true) {
                    body[i] = data[i];
                }
                else {
                }
                break;
            case 'number':
                body[i] = prop;
                break;
            case 'string':
                //await setFromProp(body, prop, value);
                let val = await this.mapStringProp(prop, data);
                body[i] = val;
                break;
            case 'object':
                let arr = prop.$name || i;
                body[i] = await this.map(data, prop)
                break;
            }
        }

        /*
        let {$import} = data;
        if ($import === 'all') {
            for (let i in data) {
                let prop = mapper[i];
                let value = data[i];
                switch (typeof prop) {
                case 'undefined':
                    body[i] = value;
                    break;
                case 'boolean':
                    if (prop === true) {
                        body[i] = value;
                    }
                    else {
                    }
                    break;
                case 'number':
                    body[i] = prop;
                    break;
                case 'string':
                    //await setFromProp(body, prop, value);
                    let {p, val} = await this.mapProp(prop, value);
                    body[p] = val;
                    break;
                case 'object':
                    let arr = prop.$name || i;
                    body[arr] = await this.map(value, prop)
                    break;
                }
            }
        }
        else {
            for (let i in mapper) {
                if (i.substr(0, 1) === '$') continue;
                let prop = mapper[i];
                let value = data[i];
                switch (typeof prop) {
                case 'boolean':
                    if (prop === true) {
                        body[i] = value;
                    }
                    else {
                    }
                    break;
                case 'number':
                    body[i] = prop;
                    break;
                case 'string':
                    //await setFromProp(body, prop, value);
                    let {p, val} = await this.mapProp(prop, value);
                    body[p] = val;
                    break;
                case 'object':
                    let arr = prop.$name || i;
                    body[arr] = await this.map(value, prop);
                    break;
                }
            }
        }
        */
        return body;
    }
}

export class MapToUsq extends MapData {
    protected async tuidId(tuid:string, value:any): Promise<string|number> {
        let sql = `select id from \`${databaseName}\`.map_${tuid} where no='${value}'`;
        let ret:any[];
        try {
            ret = await execSql(sql);
        }
        catch (err) {
            await createMapTable(tuid);
            ret = await execSql(sql);
        }
        if (ret.length === 0) {
            //if (this.usq === undefined) throw 'tuid ' + tuid + ' not defined';
            let usqIn = this.settings.in[tuid];
            if (typeof usqIn !== 'object') {
                throw `tuid ${tuid} is not defined in settings.in`;
            }
            let openApi = await getOpenApi(usqIn.usq, this.settings.unit);
            let vId = await openApi.getTuidVId(tuid);
            await map(tuid, vId, value);
            return vId;
        }
        return ret[0]['id'];    
    }
}

export class MapFromUsq extends MapData {
    protected async tuidId(tuid:string, value:any): Promise<string|number> {
        let sql = `select no from \`${databaseName}\`.map_${tuid} where no='${value}'`;
        let ret:any[] = await execSql(sql);
        if (ret.length === 0) return 'n/a';
        return ret[0].no;
    }
}
