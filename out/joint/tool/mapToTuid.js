"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../settings");
const map_1 = require("./map");
const openApi_1 = require("./openApi");
const mapData_1 = require("./mapData");
async function mapToTuid(usqIn, data) {
    let { key, mapper, usq, entity: tuid } = usqIn;
    //let {$key} = mapper;
    //let key = data[$key];
    let keyVal = data[key];
    if (key === undefined)
        throw 'key is not defined';
    let mapToUsq = new mapData_1.MapToUsq();
    let body = await mapToUsq.map(data, mapper);
    if (usq === undefined)
        throw 'tuid ' + tuid + ' not defined';
    let openApi = await openApi_1.getOpenApi(usq, settings_1.settings.unit);
    let ret = await openApi.saveTuid(tuid, body);
    let { id, inId } = ret;
    if (id < 0)
        id = -id;
    await map_1.map(tuid, id, keyVal);
    return id;
}
exports.mapToTuid = mapToTuid;
/*
async function mapProp(usq:string, prop:string, value:any): Promise<{p:string, val:any}> {
    let pos = prop.indexOf('@');
    if (pos < 0) {
        //body[prop] = value; // data[from];
        return {p:prop, val: value};
    }
    else {
        let v = prop.substr(0, pos);
        let tuid = prop.substr(pos+1);
        //let val = data[from];
        let propId = await getTuidId(usq, tuid, value);
        //body[v] = propId;
        return {p:v, val: propId};
    }
}

async function getTuidId(usq:string, tuid:string, key:string):Promise<number> {
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
        if (usq === undefined) throw 'tuid ' + tuid + ' not defined';
        let openApi = await getOpenApi(usq, settings.unit);
        let vId = await openApi.getTuidVId(tuid);
        await map(tuid, vId, key);
        return vId;
    }
    return ret[0]['id'];
}
*/ 
//# sourceMappingURL=mapToTuid.js.map