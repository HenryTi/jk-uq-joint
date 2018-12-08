import { Mapper } from "./mapper";
import { databaseName } from "../../db/mysql/database";
import { execSql, execProc } from "../../db/mysql/tool";
import { convert } from "./convert";

export async function readyOut(moniker:string, data:any, mapper:Mapper):Promise<void> {
    let {$key} = mapper;
    let key = data[$key];
    if (key === undefined) throw 'key is not defined';
    let body = await convert(data, mapper, convertTo);
    let no = undefined;
    throw 'no is not defined in readyOut'
    body['$no'] = no;
    await execProc('write_queue_out', [moniker, body]);
}

async function convertTo(prop:string, value:any): Promise<{p:string, val:any}> {
    let pos = prop.indexOf('@');
    if (pos < 0) {
        //body[prop] = value; // data[from];
        return {p:prop, val: value};
    }
    else {
        let v = prop.substr(0, pos);
        let tuid = prop.substr(pos+1);
        //let val = data[from];
        let no = await getTuidNo(tuid, value);
        //body[v] = propId;
        return {p:v, val: no};
    }
}

async function getTuidNo(tuid:string, id:number):Promise<string> {
    let sql = `select no from \`${databaseName}\`.map_${tuid} where id='${id}'`;
    let ret = await execSql(sql);
    if (ret.length === 0) {
        throw `getTuidKey error: tuid=${tuid} id=${id}`;
    }
    return ret[0]['no'];
}