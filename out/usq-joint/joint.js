"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("./db/mysql/tool");
const openApi_1 = require("./tool/openApi");
const mapData_1 = require("./tool/mapData");
const map_1 = require("./tool/map");
const router_1 = require("./router");
const interval = 60 * 1000;
class Joint {
    constructor(settings) {
        this.tick = async () => {
            try {
                console.log('tick ' + new Date().toLocaleString());
                await this.scanPull();
                await this.scanIn();
                await this.scanOut();
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
    }
    createRouter() {
        return router_1.createRouter(this.settings);
    }
    startTimer() {
        setTimeout(this.tick, 3 * 1000);
    }
    async scanPull() {
        for (let i in this.settings.pull) {
            console.log('scan pull ', i);
            let pull = this.settings.pull[i];
            for (;;) {
                let retp = await tool_1.tableFromProc('read_queue_in_p', [i]);
                let queue;
                if (!retp || retp.length === 0) {
                    queue = 0;
                }
                else {
                    queue = retp[0].queue;
                }
                let newQueue = await pull(this, queue);
                if (newQueue === undefined)
                    break;
                await tool_1.execProc('write_queue_in_p', [i, newQueue]);
            }
        }
    }
    async scanIn() {
        for (let i in this.settings.in) {
            console.log('scan in ', i);
            let usqIn = this.settings.in[i];
            for (;;) {
                let retp = await tool_1.tableFromProc('read_queue_in', [i]);
                if (!retp || retp.length === 0)
                    break;
                let { id, body, date } = retp[0];
                let data = JSON.parse(body);
                await this.usqIn(usqIn, data);
                console.log(`process in ${id} ${date.toLocaleString()}: `, body);
                await tool_1.execProc('write_queue_in_p', [i, id]);
            }
        }
    }
    async getOpenApi(usq) {
        let openApi = await openApi_1.getOpenApi(usq, this.settings.unit);
        return openApi;
    }
    async pushToUsq(usqInName, data) {
        let usqIn = this.settings.in[usqInName];
        if (usqIn === undefined) {
            console.log('usqIn "' + usqInName + '" is not defined');
            return;
        }
        await this.usqIn(usqIn, data);
    }
    async usqIn(usqIn, data) {
        if (typeof usqIn === 'function')
            await usqIn(this.settings, data);
        else {
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
                case 'action':
                    await this.usqInAction(usqIn, data);
                    break;
            }
        }
    }
    async usqInTuid(usqIn, data) {
        let { key, mapper, usq, entity: tuid } = usqIn;
        if (key === undefined)
            throw 'key is not defined';
        if (usq === undefined)
            throw 'tuid ' + tuid + ' not defined';
        let keyVal = data[key];
        let mapToUsq = new mapData_1.MapToUsq(this.settings);
        let body = await mapToUsq.map(data, mapper);
        let openApi = await this.getOpenApi(usq);
        let ret = await openApi.saveTuid(tuid, body);
        let { id, inId } = ret;
        if (id < 0)
            id = -id;
        await map_1.map(tuid, id, keyVal);
        return id;
    }
    async usqInTuidArr(usqIn, data) {
        let { key, owner, mapper, usq, entity: tuid } = usqIn;
        if (key === undefined)
            throw 'key is not defined';
        if (usq === undefined)
            throw 'usq ' + usq + ' not defined';
        if (tuid === undefined)
            throw 'tuid ' + tuid + ' not defined';
        let keyVal = data[key];
        if (owner === undefined)
            throw 'owner is not defined';
        let mapToUsq = new mapData_1.MapToUsq(this.settings);
        let ownerVal = await mapToUsq.mapOwner(owner, data);
        if (ownerVal === undefined)
            throw 'owner value is undefined';
        let body = await mapToUsq.map(data, mapper);
        let openApi = await this.getOpenApi(usq);
        let parts = tuid.split('.');
        if (parts.length === 1)
            throw 'tuid ' + tuid + ' must has .arr';
        let ret = await openApi.saveTuidArr(parts[0], parts[1], ownerVal, body);
        let { id, inId } = ret;
        if (id < 0)
            id = -id;
        await map_1.map(tuid, id, keyVal);
        return id;
    }
    async usqInMap(usqIn, data) {
        let { mapper, usq, entity } = usqIn;
        let mapToUsq = new mapData_1.MapToUsq(this.settings);
        let body = await mapToUsq.map(data, mapper);
        let openApi = await this.getOpenApi(usq);
        let { $ } = data;
        if ($ === '-')
            await openApi.delMap(entity, body);
        else
            await openApi.setMap(entity, body);
    }
    async usqInAction(usqIn, data) {
        let { mapper, usq, entity } = usqIn;
        let mapToUsq = new mapData_1.MapToUsq(this.settings);
        let body = await mapToUsq.map(data, mapper);
        let openApi = await this.getOpenApi(usq);
        await openApi.action(entity, body);
    }
    async scanOut() {
        for (let i in this.settings.out) {
            console.log('scan out ', i);
            let usqOut = this.settings.out[i];
            for (;;) {
                let queue;
                let retp = await tool_1.tableFromProc('read_queue_out_p', [i]);
                if (retp.length === 0)
                    queue = 0;
                else
                    queue = retp[0].queue;
                let ret;
                let push;
                if (typeof usqOut === 'function')
                    ret = await usqOut(this.settings, queue);
                else {
                    push = usqOut.push;
                    ret = await this.usqOutDefault(usqOut, queue);
                }
                if (ret === undefined)
                    break;
                let { queue: newQueue, data } = ret;
                if (push === undefined) {
                    await tool_1.execProc('write_queue_out', [i, newQueue, JSON.stringify(data)]);
                }
                else {
                    await push(this, data);
                    await tool_1.execProc('write_queue_out_p', [i, newQueue]);
                }
            }
        }
    }
    async usqOutDefault(usqOut, queue) {
        let ret;
        let { type } = usqOut;
        switch (type) {
            case 'sheet':
                ret = await this.usqOutSheet(usqOut, queue);
                break;
        }
        return ret;
    }
    async usqOutSheet(usqOut, queue) {
        let { usq, entity, key, mapper } = usqOut;
        let openApi = await this.getOpenApi(usq);
        let sheet = await openApi.scanSheet(entity, queue);
        if (sheet === undefined)
            return;
        let { id } = sheet;
        let mapFromUsq = new mapData_1.MapFromUsq(this.settings);
        let body = await mapFromUsq.map(sheet, mapper);
        let keyVal = 'usq-' + id;
        body[key] = keyVal;
        await map_1.map(entity, id, keyVal);
        return { queue: id, data: body };
    }
}
exports.Joint = Joint;
//# sourceMappingURL=joint.js.map