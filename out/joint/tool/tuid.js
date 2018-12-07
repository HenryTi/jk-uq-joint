"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../settings");
const map_1 = require("./map");
const openApi_1 = require("./openApi");
const database_1 = require("../../db/mysql/database");
const tool_1 = require("../../db/mysql/tool");
const createMapTable_1 = require("./createMapTable");
const tuidUsq = {};
function getUsqFromTuid(tuid) {
    let usq = tuidUsq[tuid];
    if (usq !== undefined)
        return usq;
    let { usqs } = settings_1.settings;
    for (let i in usqs) {
        let ui = usqs[i];
        let t = ui.find(v => v === tuid);
        if (t !== undefined) {
            return tuidUsq[tuid] = i;
        }
    }
    return;
}
async function saveTuid(tuid, data, mapper) {
    let { $key, $import } = mapper;
    let key = data[$key];
    if (key === undefined)
        throw 'key is not defined';
    let body = {};
    async function setFromProp(from, prop) {
        let pos = prop.indexOf('@');
        if (pos < 0) {
            body[prop] = data[from];
        }
        else {
            let v = prop.substr(0, pos);
            let tuid = prop.substr(pos + 1);
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
            if (i === '$key')
                continue;
            if (i === '$import')
                continue;
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
    if (usq === undefined)
        throw 'tuid ' + tuid + ' not defined';
    let openApi = await openApi_1.getOpenApi(usq, settings_1.settings.unit);
    let ret = await openApi.saveTuid(tuid, body);
    let { id, inId } = ret;
    if (id < 0)
        id = -id;
    await map_1.map(tuid, id, key);
    return id;
}
exports.saveTuid = saveTuid;
async function getTuidId(tuid, key) {
    let sql = `select id from \`${database_1.databaseName}\`.map_${tuid} where no='${key}'`;
    let ret;
    try {
        ret = await tool_1.execSql(sql);
    }
    catch (err) {
        await createMapTable_1.createMapTable(tuid);
        ret = await tool_1.execSql(sql);
    }
    if (ret.length === 0) {
        let usq = getUsqFromTuid(tuid);
        if (usq === undefined)
            throw 'tuid ' + tuid + ' not defined';
        let openApi = await openApi_1.getOpenApi(usq, settings_1.settings.unit);
        let vId = await openApi.getTuidVId(tuid);
        await map_1.map(tuid, vId, key);
        return vId;
    }
    return ret[0]['id'];
}
//# sourceMappingURL=tuid.js.map