"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../db/mysql/database");
const tool_1 = require("../../db/mysql/tool");
const convert_1 = require("./convert");
async function readyOut(moniker, data, mapper) {
    let { $key } = mapper;
    let key = data[$key];
    if (key === undefined)
        throw 'key is not defined';
    let body = await convert_1.convert(data, mapper, convertTo);
    let no = undefined;
    throw 'no is not defined in readyOut';
    body['$no'] = no;
    await tool_1.execProc('write_queue_out', [moniker, body]);
}
exports.readyOut = readyOut;
async function convertTo(prop, value) {
    let pos = prop.indexOf('@');
    if (pos < 0) {
        //body[prop] = value; // data[from];
        return { p: prop, val: value };
    }
    else {
        let v = prop.substr(0, pos);
        let tuid = prop.substr(pos + 1);
        //let val = data[from];
        let no = await getTuidNo(tuid, value);
        //body[v] = propId;
        return { p: v, val: no };
    }
}
async function getTuidNo(tuid, id) {
    let sql = `select no from \`${database_1.databaseName}\`.map_${tuid} where id='${id}'`;
    let ret = await tool_1.execSql(sql);
    if (ret.length === 0) {
        throw `getTuidKey error: tuid=${tuid} id=${id}`;
    }
    return ret[0]['no'];
}
//# sourceMappingURL=readyOut.js.map