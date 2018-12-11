"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("../../db/mysql/tool");
const createMapTable_1 = require("./createMapTable");
const openApi_1 = require("./openApi");
const settings_1 = require("../settings");
const database_1 = require("../../db/mysql/database");
const map_1 = require("./map");
class MapData {
    async mapProp(prop, value) {
        let pos = prop.indexOf('@');
        if (pos < 0) {
            //body[prop] = value; // data[from];
            return { p: prop, val: value };
        }
        else {
            let v = prop.substr(0, pos);
            let tuid = prop.substr(pos + 1);
            //let val = data[from];
            let propId = await this.tuidId(tuid, value);
            //body[v] = propId;
            return { p: v, val: propId };
        }
    }
    async map(data, mapper) {
        let body = {};
        let { $import } = data;
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
                        let { p, val } = await this.mapProp(prop, value);
                        body[p] = val;
                        break;
                    case 'object':
                        let arr = prop.$name || i;
                        body[arr] = await this.map(value, prop);
                        break;
                }
            }
        }
        else {
            for (let i in mapper) {
                if (i.substr(0, 1) === '$')
                    continue;
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
                        let { p, val } = await this.mapProp(prop, value);
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
class MapToUsq extends MapData {
    constructor(usq) {
        super();
        this.usq = usq;
    }
    async tuidId(tuid, value) {
        let sql = `select id from \`${database_1.databaseName}\`.map_${tuid} where no='${value}'`;
        let ret;
        try {
            ret = await tool_1.execSql(sql);
        }
        catch (err) {
            await createMapTable_1.createMapTable(tuid);
            ret = await tool_1.execSql(sql);
        }
        if (ret.length === 0) {
            //if (this.usq === undefined) throw 'tuid ' + tuid + ' not defined';
            let usqIn = settings_1.settings.in[tuid];
            if (typeof usqIn !== 'object') {
                throw `tuid ${tuid} is not defined in settings.in`;
            }
            let openApi = await openApi_1.getOpenApi(usqIn.usq, settings_1.settings.unit);
            let vId = await openApi.getTuidVId(tuid);
            await map_1.map(tuid, vId, value);
            return vId;
        }
        return ret[0]['id'];
    }
}
exports.MapToUsq = MapToUsq;
class MapFromUsq extends MapData {
    async tuidId(tuid, value) {
        let sql = `select no from \`${database_1.databaseName}\`.map_${tuid} where no='${value}'`;
        let ret = await tool_1.execSql(sql);
        if (ret.length === 0)
            return 'n/a';
        return ret[0].no;
    }
}
exports.MapFromUsq = MapFromUsq;
//# sourceMappingURL=mapData.js.map