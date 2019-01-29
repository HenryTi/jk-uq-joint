"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("../db/mysql/tool");
const createMapTable_1 = require("./createMapTable");
const openApi_1 = require("./openApi");
const database_1 = require("../db/mysql/database");
const map_1 = require("./map");
class MapData {
    //protected settings: Settings;
    //constructor(settings: Settings) {
    constructor(usqInDict, unit) {
        //this.settings = settings;
        this.usqInDict = usqInDict;
        this.unit = unit;
    }
    async mapOwner(tuidAndArr, ownerVal) {
        //let pos = owner.indexOf('@');
        //if (pos <= 0) return;
        //let v:string = owner.substr(0, pos);
        //let tuid = owner.substr(pos+1);
        let propId = await this.tuidId(tuidAndArr, ownerVal);
        return propId;
    }
    async mapProp(i, prop, data) {
        let pos = prop.indexOf('@');
        if (pos < 0) {
            return data[prop];
        }
        else {
            let v;
            if (pos === 0)
                v = i;
            else
                v = prop.substr(0, pos);
            let tuid = prop.substr(pos + 1);
            let propId = await this.tuidId(tuid, data[v]);
            return propId;
        }
    }
    async mapArrProp(i, prop, row, data) {
        let p;
        if (prop.startsWith('^')) {
            prop = prop.substr(1);
            p = data;
        }
        else {
            p = row;
        }
        let pos = prop.indexOf('@');
        if (pos < 0) {
            return p[prop];
        }
        else {
            let v;
            if (pos === 0)
                v = i;
            else
                v = prop.substr(0, pos);
            let tuid = prop.substr(pos + 1);
            let propId = await this.tuidId(tuid, p[v]);
            return propId;
        }
    }
    async map(data, mapper) {
        let body = {};
        for (let i in mapper) {
            let prop = mapper[i];
            //let value = data[i];
            switch (typeof prop) {
                case 'undefined':
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
                    let val = await this.mapProp(i, prop, data);
                    body[i] = val;
                    break;
                case 'object':
                    let arr = prop.$name || i;
                    body[i] = await this.mapArr(data, arr, prop);
                    break;
            }
        }
        return body;
    }
    async mapArr(data, arr, mapper) {
        let arrRows = data[arr];
        if (arrRows === undefined)
            arrRows = [{}];
        let ret = [];
        if (Array.isArray(arrRows) === false)
            arrRows = [arrRows];
        for (let row of arrRows) {
            let r = {};
            for (let i in mapper) {
                let prop = mapper[i];
                switch (typeof prop) {
                    case 'undefined':
                        break;
                    case 'boolean':
                        if (prop === true) {
                            r[i] = row[i];
                        }
                        else {
                        }
                        break;
                    case 'number':
                        r[i] = prop;
                        break;
                    case 'string':
                        let val = await this.mapArrProp(i, prop, row, data);
                        r[i] = val;
                        break;
                    case 'object':
                        break;
                }
            }
            ret.push(r);
        }
        return ret;
    }
}
class MapToUsq extends MapData {
    async tuidId(tuid, value) {
        //let usqIn = this.settings.in[tuid];
        let usqIn = this.usqInDict[tuid];
        if (typeof usqIn !== 'object') {
            throw `tuid ${tuid} is not defined in settings.in`;
        }
        switch (usqIn.type) {
            default:
                throw `${tuid} is not tuid in settings.in`;
            case 'tuid':
            case 'tuid-arr':
                break;
        }
        let { entity, usq } = usqIn;
        let sql = `select id from \`${database_1.databaseName}\`.\`map_${entity}\` where no='${value}'`;
        let ret;
        try {
            ret = await tool_1.execSql(sql);
        }
        catch (err) {
            await createMapTable_1.createMapTable(entity);
            ret = await tool_1.execSql(sql);
        }
        if (ret.length === 0) {
            //let openApi = await getOpenApi(usq, this.settings.unit);
            let openApi = await openApi_1.getOpenApi(usq, this.unit);
            let vId = await openApi.getTuidVId(entity);
            await map_1.map(entity, vId, value);
            return vId;
        }
        return ret[0]['id'];
    }
}
exports.MapToUsq = MapToUsq;
class MapFromUsq extends MapData {
    async tuidId(tuid, value) {
        let sql = `select no from \`${database_1.databaseName}\`.\`map_${tuid}\` where no='${value}'`;
        let ret = await tool_1.execSql(sql);
        if (ret.length === 0)
            return 'n/a';
        return ret[0].no;
    }
}
exports.MapFromUsq = MapFromUsq;
//# sourceMappingURL=mapData.js.map