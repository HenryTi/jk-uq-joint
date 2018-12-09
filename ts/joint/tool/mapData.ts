import { Mapper } from "./mapper";
import { execSql } from "../../db/mysql/tool";
import { createMapTable } from "./createMapTable";
import { getOpenApi } from "./openApi";
import { settings } from "../settings";
import { databaseName } from "../../db/mysql/database";
import { map } from "./map";

abstract class MapData {
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
        
    async map(data:any, mapper:Mapper):Promise<any> {
        let body:any = {};
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
        return body;
    }
}

export class MapToUsq extends MapData {
    private usq: string;
    constructor(usq: string) {
        super();
        this.usq = usq;
    }

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
            if (this.usq === undefined) throw 'tuid ' + tuid + ' not defined';
            let openApi = await getOpenApi(this.usq, settings.unit);
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
/*
export type ConvertId = (prop:string, value:any) => Promise<{p:string, val:any}>;

export async function mapData(data:any, mapper:Mapper, convertId: ConvertId):Promise<any> {
    let body:any = {};
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
            case 'string':
                //await setFromProp(body, prop, value);
                let {p, val} = await convertId(prop, value);
                body[p] = val;
                break;
            case 'object':
                let arr = prop.$name || i;
                body[arr] = await mapData(value, prop, convertId)
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
            case 'string':
                //await setFromProp(body, prop, value);
                let {p, val} = await convertId(prop, value);
                body[p] = val;
                break;
            case 'object':
                let arr = prop.$name || i;
                body[arr] = await mapData(value, prop, convertId)
                break;
            }
        }
    }
    return body;
}
*/
