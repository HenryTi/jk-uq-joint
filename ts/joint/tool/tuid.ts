import { settings } from '../settings';
import { map } from "./map";
import { getOpenApi, OpenApi } from "./openApi";
import { databaseName } from '../../db/mysql/database';
import { execSql } from '../../db/mysql/tool';
import { createMapTable } from './createMapTable';


const tuidUsq:{[tuid:string]:string} = {};
function getUsqFromTuid(tuid:string):string {
    let usq = tuidUsq[tuid];
    if (usq !== undefined) return usq;
    let {usqs} = settings;
    for (let i in usqs) {
        let ui:string[] = usqs[i];
        let t = ui.find(v => v===tuid);
        if (t !== undefined) {
            return tuidUsq[tuid] = i;
        }
    }
    return;
}

export interface Mapper {
    $key: string;
    $import?: 'all';
    [prop:string]: string | true;
}

export async function saveTuid(tuid:string, data:any, mapper:Mapper):Promise<number> {
    let {$key, $import} = mapper;
    let key = data[$key];
    if (key === undefined) throw 'key is not defined';
    let body:any = {};
    async function setFromProp(from:string, prop:string) {
        let pos = prop.indexOf('@');
        if (pos < 0) {
            body[prop] = data[from];
        }
        else {
            let v = prop.substr(0, pos);
            let tuid = prop.substr(pos+1);
            let val = data[from];
            let propId = await getTuidId(tuid, val);
            data[from] = propId;
        }
    }
    if ($import === 'all') {
        for (let i in data) {
            let prop = mapper[i];
            if (prop === undefined) {
                body[i] = data[i];
            }
            else if (prop === true) {
                body[i] = data[i];
            }
            else {
                await setFromProp(i, prop);
            }
        }
    }
    else {
        for (let i in mapper) {
            if (i === '$key') continue;
            if (i === '$import') continue;
            let prop = mapper[i];
            if (prop === true) {
                body[i] = data[i];
            }
            else {
                await setFromProp(i, prop);
            }
        }
    }

    let usq = getUsqFromTuid(tuid);
    if (usq === undefined) throw 'tuid ' + tuid + ' not defined';
    let openApi = await getOpenApi(usq, settings.unit);
    let ret = await openApi.saveTuid(tuid, body);
    let {id, inId} = ret;
    if (id < 0) id = -id;
    await map(tuid, id, key);
    return id;
}

async function getTuidId(tuid:string, key:string):Promise<number> {
    let sql = `select id from \`${databaseName}\`.map_${tuid} where no='${key}'`;
    let ret:any[];
    try {
        ret = await execSql(sql);
    }
    catch (err) {
        await createMapTable(tuid);
        ret = await execSql(sql);
    }
    if (ret.length === 0) {
        let usq = getUsqFromTuid(tuid);
        if (usq === undefined) throw 'tuid ' + tuid + ' not defined';
        let openApi = await getOpenApi(usq, settings.unit);
        let vId = await openApi.getTuidVId(tuid);
        await map(tuid, vId, key);
        return vId;
    }
    return ret[0]['id'];
}
