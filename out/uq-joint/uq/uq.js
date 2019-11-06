"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tuid_1 = require("./tuid");
const $unitx = '$$$/$unitx';
class Uqs {
    constructor(joint, unit) {
        this.uqs = {};
        this.joint = joint;
        this.unit = unit;
    }
    async getOpenApi(uq) {
        return await this.joint.getOpenApi(uq);
    }
    async getUq(uqFullName) {
        let uq = this.uqs[uqFullName];
        if (uq !== undefined)
            return uq;
        return this.uqs[uqFullName] = await this.createUq(uqFullName);
    }
    async createUq(uqFullName) {
        let uq = new Uq(this, uqFullName, this.unit);
        await uq.initBuild();
        this.uqs[uqFullName] = uq;
        return uq;
    }
    async init() {
        this.unitx = new UqUnitx(this, $unitx, this.unit);
        await this.unitx.initBuild();
    }
    async readBus(face, queue) {
        return await this.unitx.readBus(face, queue);
    }
    async writeBus(face, source, newQueue, busVersion, body) {
        await this.unitx.writeBus(face, source, newQueue, busVersion, body);
    }
}
exports.Uqs = Uqs;
class Uq {
    constructor(uqs, uqFullName, unit) {
        this.tuids = {};
        this.tuidArr = [];
        this.uqs = uqs;
        this.uqFullName = uqFullName;
        this.unit = unit;
    }
    async buildData(data, props) {
        if (data === undefined)
            return;
        let ret = {};
        let names = [];
        let promises = [];
        for (let i in data) {
            let v = data[i];
            if (v === undefined)
                continue;
            let prop = props[i];
            if (prop === undefined) {
                ret[i] = v;
                continue;
            }
            let { uq: uqFullName, tuid: tuidName, tuidOwnerProp } = prop;
            let tuid = await this.getTuidFromUq(uqFullName, tuidName);
            if (tuid === undefined)
                continue;
            names.push(i);
            let ownerId = tuidOwnerProp && data[tuidOwnerProp];
            promises.push(this.buildTuidValue(tuid, prop, v, ownerId));
        }
        let len = names.length;
        if (len > 0) {
            let values = await Promise.all(promises);
            for (let i = 0; i < len; i++) {
                ret[names[i]] = values[i];
            }
        }
        return ret;
    }
    async buildTuidValue(tuid, prop, id, ownerId) {
        let tuidFrom = await tuid.getTuidFrom();
        let all;
        let props;
        if (prop === undefined) {
            all = false;
        }
        else {
            all = prop.all;
            props = prop.props;
        }
        let ret = await tuidFrom.loadValue(id, ownerId, all);
        if (props === undefined)
            return ret;
        let names = [];
        let promises = [];
        for (let f of tuidFrom.fields) {
            let { _tuid, _ownerField } = f;
            if (_tuid === undefined)
                continue;
            let { name } = f;
            //if (name === 'address') debugger;
            let prp = props[name];
            if (prp === undefined)
                continue;
            let v = ret[name];
            if (v === undefined)
                continue;
            let vType = typeof v;
            if (vType === 'object')
                continue;
            let p;
            if (typeof prp === 'boolean')
                p = undefined;
            else
                p = prp;
            names.push(name);
            let ownerId = _ownerField && ret[_ownerField.name];
            promises.push(this.buildTuidValue(_tuid, p, v, ownerId));
        }
        let len = names.length;
        if (len > 0) {
            let values = await Promise.all(promises);
            for (let i = 0; i < len; i++) {
                ret[names[i]] = values[i];
            }
        }
        return ret;
    }
    async getFromUq(uqFullName) {
        let uq = await this.uqs.getUq(uqFullName);
        return uq;
    }
    async getTuidFromUq(uqFullName, tuidName) {
        tuidName = tuidName.toLowerCase();
        if (uqFullName === undefined)
            return this.getTuidFromName(tuidName);
        let uq = await this.uqs.getUq(uqFullName);
        if (uq === undefined)
            return;
        let tuid = uq.getTuidFromName(tuidName);
        if (tuid.from !== undefined) {
            let { owner, uq: uqName } = tuid.from;
            let fromUq = await this.uqs.getUq(owner + '/' + uqName);
            if (fromUq === undefined)
                return;
            tuid = fromUq.getTuidFromName(tuidName);
        }
        return tuid;
    }
    getTuidFromName(tuidName) {
        let parts = tuidName.split('.');
        return this.getTuid(parts[0], parts[1]);
    }
    async saveTuid(tuid, body) {
        return await this.openApi.saveTuid(tuid, body);
    }
    async saveTuidArr(tuid, tuidArr, ownerId, body) {
        return await this.openApi.saveTuidArr(tuid, tuidArr, ownerId, body);
    }
    async getTuidVId(ownerEntity) {
        return await this.openApi.getTuidVId(ownerEntity);
    }
    async setMap(map, body) {
        await this.openApi.setMap(map, body);
    }
    async delMap(map, body) {
        await this.openApi.delMap(map, body);
    }
    async initBuild() {
        await this.initOpenApi();
        await this.loadEntities();
    }
    async initOpenApi() {
        /*
        let uqUrl = await centerApi.urlFromUq(this.unit, this.uqFullName);
        if (uqUrl === undefined) return;
        let { url, urlDebug } = uqUrl;
        url = await host.getUrlOrDebug(url, urlDebug);
        */
        this.openApi = await this.uqs.getOpenApi(this.uqFullName); //new OpenApi(url, this.unit);
    }
    buildTuids(tuids) {
        for (let i in tuids) {
            let schema = tuids[i];
            let { name, typeId } = schema;
            let tuid = this.newTuid(i, typeId);
            tuid.sys = true;
        }
        for (let i in tuids) {
            let schema = tuids[i];
            let { name } = schema;
            let tuid = this.getTuid(i);
            //tuid.sys = true;
            tuid.setSchema(schema);
        }
    }
    buildAccess(access) {
        for (let a in access) {
            let v = access[a];
            switch (typeof v) {
                case 'string':
                    this.fromType(a, v);
                    break;
                case 'object':
                    this.fromObj(a, v);
                    break;
            }
        }
    }
    fromType(name, type) {
        let parts = type.split('|');
        type = parts[0];
        let id = Number(parts[1]);
        switch (type) {
            case 'uq':
                this.id = id;
                break;
            case 'tuid':
                let tuid = this.newTuid(name, id);
                tuid.sys = false;
                break;
            /*
            case 'action': this.newAction(name, id); break;
            case 'query': this.newQuery(name, id); break;
            case 'book': this.newBook(name, id); break;
            case 'map': this.newMap(name, id); break;
            case 'history': this.newHistory(name, id); break;
            case 'sheet':this.newSheet(name, id); break;
            case 'pending': this.newPending(name, id); break;
            */
        }
    }
    fromObj(name, obj) {
        switch (obj['$']) {
            //case 'sheet': this.buildSheet(name, obj); break;
        }
    }
    async loadEntities() {
        let entities = await this.openApi.loadEntities();
        this.buildEntities(entities);
    }
    buildEntities(entities) {
        let { access, tuids } = entities;
        this.buildTuids(tuids);
        this.buildAccess(access);
    }
    getTuid(name, div, tuidUrl) {
        let tuid = this.tuids[name];
        if (tuid === undefined)
            return;
        if (div === undefined)
            return tuid;
        return tuid.divs[div];
    }
    newTuid(name, entityId) {
        let tuid = this.tuids[name];
        if (tuid !== undefined)
            return tuid;
        tuid = this.tuids[name] = new tuid_1.TuidMain(this, name, entityId);
        this.tuidArr.push(tuid);
        return tuid;
    }
    buildFieldTuid(fields, mainFields) {
        if (fields === undefined)
            return;
        for (let f of fields) {
            let { tuid, arr, url } = f;
            if (tuid === undefined)
                continue;
            f._tuid = this.getTuid(tuid, arr, url);
        }
        for (let f of fields) {
            let { owner } = f;
            if (owner === undefined)
                continue;
            let ownerField = fields.find(v => v.name === owner);
            if (ownerField === undefined) {
                if (mainFields !== undefined) {
                    ownerField = mainFields.find(v => v.name === owner);
                }
                if (ownerField === undefined) {
                    throw `owner field ${owner} is undefined`;
                }
            }
            f._ownerField = ownerField;
            let { arr, url } = f;
            f._tuid = this.getTuid(ownerField._tuid.name, arr, url);
            if (f._tuid === undefined)
                throw 'owner field ${owner} is not tuid';
        }
    }
    buildArrFieldsTuid(arrFields, mainFields) {
        if (arrFields === undefined)
            return;
        for (let af of arrFields) {
            let { fields } = af;
            if (fields === undefined)
                continue;
            this.buildFieldTuid(fields, mainFields);
        }
    }
}
exports.Uq = Uq;
class UqUnitx extends Uq {
    async readBus(face, queue) {
        return await this.openApi.readBus(face, queue);
    }
    async writeBus(face, source, newQueue, busVersion, body) {
        await this.openApi.writeBus(face, source, newQueue, busVersion, body);
    }
    async loadEntities() {
    }
}
//# sourceMappingURL=uq.js.map