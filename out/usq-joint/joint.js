"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("./db/mysql/tool");
const mapData_1 = require("./tool/mapData");
const map_1 = require("./tool/map");
const router_1 = require("./router");
const database_1 = require("./db/mysql/database");
const createMapTable_1 = require("./tool/createMapTable");
const faceSchemas_1 = require("./tool/faceSchemas");
const usq_1 = require("./usq/usq");
const interval = 60 * 1000;
class Joint {
    constructor(settings) {
        this.usqInDict = {};
        this.tick = async () => {
            try {
                console.log('tick ' + new Date().toLocaleString());
                //await this.scanPull();
                await this.scanIn();
                await this.scanOut();
                await this.scanBus();
            }
            catch (err) {
                console.error('error in timer tick');
                console.error(err);
            }
            finally {
                setTimeout(this.tick, interval);
            }
        };
        this.settings = settings;
        let { unit, usqIns } = settings;
        this.unit = unit;
        if (usqIns === undefined)
            return;
        this.usqs = new usq_1.Usqs(unit);
        for (let usqIn of usqIns) {
            let { entity, type } = usqIn;
            if (this.usqInDict[entity] !== undefined)
                throw 'can not have multiple ' + entity;
            this.usqInDict[entity] = usqIn;
        }
    }
    createRouter() {
        return router_1.createRouter(this.settings);
    }
    async start() {
        await this.usqs.init();
        setTimeout(this.tick, 3 * 1000);
    }
    /*
    private async scanPull() {
        for (let i in this.settings.pull) {
            console.log('scan pull ', i);
            let pull = this.settings.pull[i];
            for (;;) {
                let retp = await tableFromProc('read_queue_in_p', [i]);
                let queue:number;
                if (!retp || retp.length === 0) {
                    queue = 0;
                }
                else {
                    queue = retp[0].queue;
                }
                let newQueue = await pull(this, queue);
                if (newQueue === undefined) break;
                await execProc('write_queue_in_p', [i, newQueue]);
            }
        }
    }
    */
    async scanIn() {
        let { usqIns } = this.settings;
        if (usqIns === undefined)
            return;
        for (let usqIn of usqIns) {
            let { usq, entity } = usqIn;
            let queueName = usq + ':' + entity;
            console.log('scan in ' + queueName);
            for (;;) {
                let retp = await tool_1.tableFromProc('read_queue_in', [queueName]);
                if (!retp || retp.length === 0)
                    break;
                let { id, body, date } = retp[0];
                let data = JSON.parse(body);
                await this.usqIn(usqIn, data);
                console.log(`process in ${id} ${date.toLocaleString()}: `, body);
                await tool_1.execProc('write_queue_in_p', [queueName, id]);
            }
        }
    }
    /*
    protected async getOpenApi(usq: string) {
        let openApi = await getOpenApi(usq, this.settings.unit);
        return openApi;
    }
    */
    /*
    async pushToUsq(usqInName:string, data:any) {
        let usqIn = this.settings.in[usqInName];
        if (usqIn === undefined) {
            console.log('usqIn "' + usqInName + '" is not defined');
            return;
        }
        await this.usqIn(usqIn, data);
    }
    */
    async usqIn(usqIn, data) {
        /*
        if (typeof usqIn === 'function')
            await usqIn(this.settings, data);
        else {
        */
        switch (usqIn.type) {
            case 'tuid':
                await this.usqInTuid(usqIn, data);
                break;
            case 'tuid-arr':
                await this.usqInTuidArr(usqIn, data);
                break;
            case 'map':
                await this.usqInMap(usqIn, data);
                break;
        }
        //}
    }
    async usqInTuid(usqIn, data) {
        let { key, mapper, usq: usqFullName, entity: tuid } = usqIn;
        if (key === undefined)
            throw 'key is not defined';
        if (usqFullName === undefined)
            throw 'tuid ' + tuid + ' not defined';
        let keyVal = data[key];
        let mapToUsq = new mapData_1.MapToUsq(this.usqInDict, this.unit);
        let body = await mapToUsq.map(data, mapper);
        //let openApi = await this.getOpenApi(usq);
        let usq = await this.usqs.getUsq(usqFullName);
        let ret = await usq.saveTuid(tuid, body);
        let { id, inId } = ret;
        if (id < 0)
            id = -id;
        await map_1.map(tuid, id, keyVal);
        return id;
    }
    async usqInTuidArr(usqIn, data) {
        let { key, owner, mapper, usq: usqFullName, entity } = usqIn;
        if (key === undefined)
            throw 'key is not defined';
        if (usqFullName === undefined)
            throw 'usq ' + usqFullName + ' not defined';
        if (entity === undefined)
            throw 'tuid ' + entity + ' not defined';
        let parts = entity.split('.');
        let tuid = parts[0];
        if (parts.length === 1)
            throw 'tuid ' + entity + ' must has .arr';
        let tuidArr = parts[1];
        let keyVal = data[key];
        if (owner === undefined)
            throw 'owner is not defined';
        let ownerVal = data[owner];
        let mapToUsq = new mapData_1.MapToUsq(this.usqInDict, this.unit);
        //let ownerId = await mapToUsq.mapOwner(entity, ownerVal);
        let ownerId = await this.mapOwner(usqIn, tuid, ownerVal);
        if (ownerId === undefined)
            throw 'owner value is undefined';
        let body = await mapToUsq.map(data, mapper);
        //let openApi = await this.getOpenApi(usq);
        //let ret = await openApi.saveTuidArr(tuid, tuidArr, ownerId, body);
        let usq = await this.usqs.getUsq(usqFullName);
        let ret = await usq.saveTuidArr(tuid, tuidArr, ownerId, body);
        let { id, inId } = ret;
        if (id === undefined)
            id = inId;
        else if (id < 0)
            id = -id;
        await map_1.map(entity, id, keyVal);
        return id;
    }
    async mapOwner(usqIn, ownerEntity, ownerVal) {
        let { usq: usqFullName } = usqIn;
        let sql = `select id from \`${database_1.databaseName}\`.\`map_${ownerEntity}\` where no='${ownerVal}'`;
        let ret;
        try {
            ret = await tool_1.execSql(sql);
        }
        catch (err) {
            await createMapTable_1.createMapTable(ownerEntity);
            ret = await tool_1.execSql(sql);
        }
        if (ret.length === 0) {
            /*
            let usqIn = this.settings.in[tuid];
            if (typeof usqIn !== 'object') {
                throw `tuid ${tuid} is not defined in settings.in`;
            }
            */
            //let openApi = await getOpenApi(usq, this.settings.unit);
            //let vId = await openApi.getTuidVId(ownerEntity);
            let usq = await this.usqs.getUsq(usqFullName);
            let vId = await usq.getTuidVId(ownerEntity);
            await map_1.map(ownerEntity, vId, ownerVal);
            return vId;
        }
        return ret[0]['id'];
    }
    async usqInMap(usqIn, data) {
        let { mapper, usq: usqFullName, entity } = usqIn;
        let mapToUsq = new mapData_1.MapToUsq(this.usqInDict, this.unit);
        let body = await mapToUsq.map(data, mapper);
        let usq = await this.usqs.getUsq(usqFullName);
        //let openApi = await this.getOpenApi(usq);
        let { $ } = data;
        if ($ === '-')
            //await openApi.delMap(entity, body);
            await usq.delMap(entity, body);
        else
            //await openApi.setMap(entity, body);
            await usq.setMap(entity, body);
    }
    async scanOut() {
        let { usqOuts } = this.settings;
        if (usqOuts === undefined)
            return;
        for (let usqOut of usqOuts) {
            let { usq, entity } = usqOut;
            let queueName = usq + ':' + entity;
            console.log('scan out ' + queueName);
            for (;;) {
                let queue;
                let retp = await tool_1.tableFromProc('read_queue_out_p', [queueName]);
                if (retp.length === 0)
                    queue = 0;
                else
                    queue = retp[0].queue;
                let ret;
                //let push: DataPush;
                /*
                if (typeof usqOut === 'function')
                    ret = await usqOut(this.settings, queue);
                else {
                */
                //push = usqOut.push;
                ret = await this.usqOut(usqOut, queue);
                //}
                if (ret === undefined)
                    break;
                let { queue: newQueue, data } = ret;
                //if (push === undefined) {
                //    await execProc('write_queue_out', [i, newQueue, JSON.stringify(data)]);
                //}
                //else {
                //    await push(this, data);
                await tool_1.execProc('write_queue_out_p', [queueName, newQueue]);
                //}
            }
        }
    }
    async usqOut(usqOut, queue) {
        let ret;
        let { type } = usqOut;
        switch (type) {
            //case 'bus': ret = await this.usqOutBus(usqOut as UsqOutBus, queue); break;
        }
        return ret;
    }
    async scanBus() {
        let { name: joinName, bus } = this.settings;
        if (bus === undefined)
            return;
        let monikerPrefix = '$bus/';
        //let openApi = await this.getOpenApi($unitx);
        for (let usqBus of bus) {
            let { face, mapper, push, pull } = usqBus;
            // bus out
            let moniker = monikerPrefix + face;
            for (;;) {
                if (push === undefined)
                    break;
                let queue;
                let retp = await tool_1.tableFromProc('read_queue_out_p', [moniker]);
                if (retp.length > 0) {
                    queue = retp[0].queue;
                }
                let message = await this.usqs.readBus(face, queue);
                if (message === undefined)
                    break;
                let { id: newQueue, from, body } = message;
                //await this.busOut(face, newQueue, message, mapper, push);
                let json = await faceSchemas_1.faceSchemas.unpackBusData(face, body);
                let mapFromUsq = new mapData_1.MapFromUsq(this.usqInDict, this.unit);
                let outBody = await mapFromUsq.map(json, mapper);
                if (await push(this, face, queue, outBody) === false)
                    break;
                await tool_1.execProc('write_queue_out_p', [moniker, newQueue]);
            }
            // bus in
            for (;;) {
                if (pull === undefined)
                    break;
                let queue;
                let retp = await tool_1.tableFromProc('read_queue_in_p', [moniker]);
                if (retp.length > 0) {
                    queue = retp[0].queue;
                }
                let message = await pull(this, face, queue);
                if (message === undefined)
                    break;
                let { queue: newQueue, data } = message;
                //let newQueue = await this.busIn(queue);
                //if (newQueue === undefined) break;
                let mapToUsq = new mapData_1.MapToUsq(this.usqInDict, this.unit);
                let inBody = await mapToUsq.map(data, mapper);
                let packed = await faceSchemas_1.faceSchemas.packBusData(face, inBody);
                await this.usqs.writeBus(face, joinName, newQueue, packed);
                await tool_1.execProc('write_queue_in_p', [moniker, newQueue]);
            }
        }
    }
}
exports.Joint = Joint;
//# sourceMappingURL=joint.js.map