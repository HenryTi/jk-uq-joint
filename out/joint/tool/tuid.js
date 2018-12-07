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
async function saveTuid(tuid, key, data) {
    for (let i in data) {
        let prop = data[i];
        if (typeof prop === 'object') {
            let propId = await getTuidId(prop.tuid, prop.val);
            data[i] = propId;
        }
    }
    let usq = getUsqFromTuid(tuid);
    if (usq === undefined)
        throw 'tuid ' + tuid + ' not defined';
    let openApi = await openApi_1.getOpenApi(usq, settings_1.settings.unit);
    let ret = await openApi.saveTuid(tuid, data);
    let { id, inId, stamp } = ret;
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