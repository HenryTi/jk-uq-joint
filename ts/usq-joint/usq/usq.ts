import { Headers } from "node-fetch";
import { Fetch } from "../tool/fetch";
import { centerApi } from "../tool/centerApi";
import { host } from "../tool/host";
import { TuidMain, Tuid } from "./tuid";
import { Field, ArrFields } from "./field";
import { isDate } from "util";

const $unitx = '$$$/$unitx';

export class Usqs {
    private usqs:{[name:string]:Usq} = {};    
    private unit:number;
    private unitx: UsqUnitx;
    constructor(unit:number) {
        this.unit = unit;
    }

    async getUsq(usqFullName:string) {
        let usq = this.usqs[usqFullName];
        if (usq !== undefined) return usq;
        return this.usqs[usqFullName] = await this.createUsq(usqFullName);
    }

    private async createUsq(usqFullName:string):Promise<Usq> {
        let usq = new Usq(this, usqFullName, this.unit);
        await usq.initBuild();
        this.usqs[usqFullName] = usq;
        return usq;
    }

    async init() {
        this.unitx = new UsqUnitx(this, $unitx, this.unit);
        await this.unitx.initBuild();
    }

    async readBus(face:string, queue:number):Promise<any> {
        return await this.unitx.readBus(face, queue);
    }
    
    async writeBus(face:string, source:string, newQueue:number, body:any) {
        await this.unitx.writeBus(face, source, newQueue, body);
    }
}

export class Usq {
    //private usqOwner:string;
    //private usqName:string;
    //private unit:number;
    private usqs:Usqs;
    private usqFullName:string;
    private unit:number;
    private tuids: {[name:string]: TuidMain} = {};
    private tuidArr: TuidMain[] = [];

    openApi: OpenApi;
    id: number;

    constructor(usqs:Usqs, usqFullName:string, unit:number) {
        this.usqs = usqs;
        this.usqFullName = usqFullName;
        this.unit = unit;
    }

    async buildData(data:any, props: {[name:string]: UsqProp}) {
        if (data === undefined) return;
        let ret:any = {};
        let names:string[] = [];
        let promises: Promise<any>[] = [];
        for (let i in data) {
            let v = data[i];
            let prop = props[i];
            if (prop === undefined) {
                ret[i] = v;
                continue;
            }
            let {usq:usqFullName, tuid:tuidName, tuidOwnerProp} = prop;
            let tuid:Tuid = await this.getTuidFromUsq(usqFullName, tuidName);
            if (tuid === undefined) continue;
            names.push(i);
            let ownerId = data[tuidOwnerProp];
            promises.push(this.buildTuidValue(tuid, prop, v, ownerId));
        }
        let len = names.length;
        if (len > 0) {
            let values = await Promise.all(promises);
            for (let i=0; i<len; i++) {
                ret[names[i]] = values[i];
            }
        }
        return ret;
    }

    private async buildTuidValue(tuid:Tuid, prop:Prop, id:number, ownerId:number):Promise<any> {
        let all:boolean;
        if (prop === undefined) all = false;
        else all = prop.all;
        let ret = await tuid.loadValue(id, ownerId, all);
        let props = prop.props;
        if (props !== undefined) {
            let names:string[] = [];
            let promises: Promise<any>[] = [];
            for (let f of tuid.fields) {
                let {_tuid, _ownerField} = f;
                if (_tuid === undefined) continue;
                let {name} = f;
                let prp = props[name];
                if (prp === undefined) continue;
                let p:Prop;
                if (typeof prp === 'boolean') p = undefined;
                else p = prp as Prop;
                names.push(name);
                let v = ret[name];
                let ownerId = ret[_ownerField.name];
                promises.push(this.buildTuidValue(_tuid, p, v, ownerId));
            }
            let len = names.length;
            if (len > 0) {
                let values = await Promise.all(promises);
                for (let i=0; i<len; i++) {
                    ret[names[i]] = values[i];
                }
            }
        }
        return ret;
    }
    
    async getTuidFromUsq(usqFullName:string, tuidName:string):Promise<Tuid> {
        if (usqFullName === undefined) return this.getTuidFromName(tuidName);
        let usq = await this.usqs.getUsq(usqFullName);
        if (usq === undefined) return;
        return usq.getTuidFromName(tuidName);
    }

    getTuidFromName(tuidName:string) {
        let parts = tuidName.split('.');
        return this.getTuid(parts[0], parts[1]);
}

    async saveTuid(tuid:string, body:any):Promise<{id:number, inId:number}> {
        return await this.openApi.saveTuid(tuid, body);
    }

    async saveTuidArr(tuid:string, tuidArr:string, ownerId:number, body:any):Promise<{id:number, inId:number}> {
        return await this.openApi.saveTuidArr(tuid, tuidArr, ownerId, body);
    }

    async getTuidVId(ownerEntity:string):Promise<number> {
        return await this.openApi.getTuidVId(ownerEntity);
    }

    async setMap(map:string, body:any) {
        await this.openApi.setMap(map, body);
    }

    async delMap(map:string, body:any) {
        await this.openApi.delMap(map, body);
    }

    async initBuild() {
        await this.initOpenApi();
        await this.loadEntities();
    }

    private async initOpenApi():Promise<void> {
        let usqUrl = await centerApi.urlFromUsq(this.unit, this.usqFullName);
        if (usqUrl === undefined) return;
        let {url, urlDebug} = usqUrl;
        url = await host.getUrlOrDebug(url, urlDebug);
        this.openApi = new OpenApi(url, this.unit);
    }
    
    private buildTuids(tuids:any) {
        for (let i in tuids) {
            let schema = tuids[i];
            let {name, typeId} = schema;
            let tuid = this.newTuid(i, typeId);
            tuid.sys = true;
        }
        for (let i in tuids) {
            let schema = tuids[i];
            let {name} = schema;
            let tuid = this.getTuid(i);
            //tuid.sys = true;
            tuid.setSchema(schema);
        }
    }

    private buildAccess(access:any) {
        for (let a in access) {
            let v = access[a];
            switch (typeof v) {
                case 'string': this.fromType(a, v); break;
                case 'object': this.fromObj(a, v); break;
            }
        }
    }

    private fromType(name:string, type:string) {
        let parts = type.split('|');
        type = parts[0];
        let id = Number(parts[1]);
        switch (type) {
            case 'usq': this.id = id; break;
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
    
    private fromObj(name:string, obj:any) {
        switch (obj['$']) {
            //case 'sheet': this.buildSheet(name, obj); break;
        }
    }

    private async loadEntities() {
        let entities = await this.openApi.loadEntities();
        this.buildEntities(entities);
    }

    private buildEntities(entities:any) {
        if (entities === undefined) {
            debugger;
        }
        let {access, tuids} = entities;
        this.buildTuids(tuids);
        this.buildAccess(access);
    }

    getTuid(name:string, div?:string, tuidUrl?:string): Tuid {
        let tuid = this.tuids[name];
        if (tuid === undefined) return;
        if (div === undefined) return tuid;
        return tuid.divs[div];
    }

    private newTuid(name:string, entityId:number):TuidMain {
        let tuid = this.tuids[name];
        if (tuid !== undefined) return tuid;
        tuid = this.tuids[name] = new TuidMain(this, name, entityId);
        this.tuidArr.push(tuid);
        return tuid;
    }
    buildFieldTuid(fields:Field[], mainFields?:Field[]) {
        if (fields === undefined) return;
        for (let f of fields) {
            let {tuid, arr, url} = f;
            if (tuid === undefined) continue;
            f._tuid = this.getTuid(tuid, arr, url);
        }
        for (let f of fields) {
            let {owner} = f;
            if (owner === undefined) continue;
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
            let {arr, url} = f;
            f._tuid = this.getTuid(ownerField._tuid.name, arr, url);
            if (f._tuid === undefined) throw 'owner field ${owner} is not tuid';
        }
    }
    buildArrFieldsTuid(arrFields:ArrFields[], mainFields:Field[]) {
        if (arrFields === undefined) return;
        for (let af of arrFields) {
            let {fields} = af;
            if (fields === undefined) continue;
            this.buildFieldTuid(fields, mainFields);
        }
    }
}

class UsqUnitx extends Usq {
    async readBus(face:string, queue:number):Promise<any> {
        return await this.openApi.readBus(face, queue);
    }
    
    async writeBus(face:string, source:string, newQueue:number, body:any) {
        await this.openApi.writeBus(face, source, newQueue, body);
    }
}

interface Prop {
    all?: boolean;      // 获取tuid的时候，all=true则取全部属性，all=false or undeinfed则取主要属性
    props?: {[name:string]: Prop|boolean}
}

interface UsqProp extends Prop {
    usq?: string;
    tuid: string;
    tuidOwnerProp?: string;
}

interface BusMessage {
    id: number;
    face: string;
    from: string;
    body: string;
}

export class OpenApi extends Fetch {
    protected unit:number;
    constructor(baseUrl:string, unit:number) {
        super(baseUrl);
        this.unit = unit;
    }

    protected appendHeaders(headers:Headers) {
        headers.append('unit', String(this.unit));
    }

    async fresh(unit:number, stamps:any):Promise<any> {
        let ret = await this.post('open/fresh', {
            unit: unit,
            stamps: stamps
        });
        return ret;
    }
    async bus(faces:string, faceUnitMessages:string) {
        let ret = await this.post('open/bus', {
            faces: faces,
            faceUnitMessages: faceUnitMessages,
        });
        return ret;
    }
    async readBus(face:string, queue:number):Promise<BusMessage> {
        let ret = await this.post('open/joint-read-bus', {
            unit: this.unit, 
            face: face, 
            queue: queue
        });
        return ret;
    }
    async writeBus(face:string, from:string, queue:number, body:string):Promise<BusMessage> {
        let ret = await this.post('open/joint-write-bus', {
            unit: this.unit, 
            face: face, 
            from: from,
            sourceId: queue,
            body: body,
        });
        return ret;
    }
    async tuid(id: number, tuid:string, maps: string[]):Promise<any> {
        let ret = await this.post('open/tuid', {
            unit: this.unit,
            id: id,
            tuid: tuid,
            maps: maps,
        });
        return ret;
    }
    async saveTuid(tuid:string, data:any):Promise<any> {
        let ret = await this.post('joint/tuid/' + tuid, data);
        return ret;
    }
    async saveTuidArr(tuid:string, arr:string, owner:number, data:any):Promise<any> {
        let ret = await this.post(`joint/tuid-arr/${tuid}/${owner}/${arr}`, data);
        return ret;
    }
    async getTuidVId(tuid:string):Promise<number> {
        let parts = tuid.split('.');
        let url:string;
        if (parts.length === 1)
            url = `joint/tuid-vid/${tuid}`;
        else
            url = `joint/tuid-arr-vid/${parts[0]}/${parts[1]}`;
        let ret = await this.get(url);
        return ret;
    }
    async loadTuidValue(tuidName:string, divName:string, id:number, ownerId:number, allProps:boolean) {
        let ret = await this.post(`open/tuid-value/${tuidName}/${divName}`, 
            {unit:this.unit, id:id, ownerId:ownerId, all:allProps});
        return ret;
    }
    async scanSheet(sheet:string, scanStartId:number):Promise<any> {
        let ret = await this.get('joint/sheet-scan/' + sheet + '/' + scanStartId);
        return ret;
    }
    async action(action:string, data:any):Promise<void> {
        await this.post('joint/action-json/' + action, data);
    }
    async setMap(map:string, data:any):Promise<void> {
        await this.post('joint/action-json/' + map + '$add$', data);
    }
    async delMap(map:string, data:any):Promise<void> {
        await this.post('joint/action-json/' + map + '$del$', data);
    }

    async loadEntities() {
        return await this.get('open/entities/' + this.unit);
    }

    async schema(entityName: string) {
        return await this.get('open/entity/' + entityName);
    }
}
