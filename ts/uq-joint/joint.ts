import { Router } from "express";
import { Settings, UqIn, UqOut, DataPush, UqInTuid, UqInMap, UqInTuidArr } from "./defines";
import { tableFromProc, execProc, execSql } from "./db/mysql/tool";
import { MapFromUq as MapFromUq, MapToUq as MapToUq } from "./tool/mapData";
import { map } from "./tool/map"; import { createRouter } from './router';
import { databaseName } from "./db/mysql/database";
import { createMapTable } from "./tool/createMapTable";
import { faceSchemas } from "./tool/faceSchemas";
import { Uqs } from "./uq/uq";

const interval = 3 * 1000;

export class Joint {
    protected uqs: Uqs;
    protected settings: Settings;
    protected uqInDict: { [tuid: string]: UqIn } = {};
    protected unit: number;

    constructor(settings: Settings) {
        this.settings = settings;
        let { unit, uqIns: uqIns } = settings;
        this.unit = unit;
        if (uqIns === undefined) return;
        this.uqs = new Uqs(unit);
        for (let uqIn of uqIns) {
            let { entity, type } = uqIn;
            if (this.uqInDict[entity] !== undefined) throw 'can not have multiple ' + entity;
            this.uqInDict[entity] = uqIn;
        }
    }

    createRouter(): Router {
        return createRouter(this.settings);
    }

    async start() {
        await this.uqs.init();
        setTimeout(this.tick, interval);
    }

    private tick = async () => {
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

    private async scanIn() {
        let { uqIns, pullReadFromSql } = this.settings;
        if (uqIns === undefined) return;//
        for (let uqIn of uqIns) {
            let { uq, entity, pull, pullWrite } = uqIn;
            let queueName = uq + ':' + entity;
            console.log('scan in ' + queueName);
            for (; ;) {
                let message: any;
                let queue: number;
                if (pull !== undefined) {
                    let retp = await tableFromProc('read_queue_in_p', [queueName]);
                    if (retp.length > 0) {
                        queue = retp[0].queue;
                    } else {
                        queue = 0;
                    }
                    let ret = undefined;
                    switch (typeof pull) {
                        case 'function':
                            ret = await pull(this, uqIn, queue);
                            break;
                        case 'string':
                            if (pullReadFromSql === undefined) {
                                let err = 'pullReadFromSql should be defined in settings!';
                                console.error(err);
                                throw err;
                            }
                            ret = await pullReadFromSql(pull as string, queue);
                            break;
                    }
                    if (ret === undefined) break;
                    queue = ret.queue;
                    message = ret.data;
                }
                else {
                    let retp = await tableFromProc('read_queue_in', [queueName]);
                    if (!retp || retp.length === 0) break;
                    let { id, body, date } = retp[0];
                    queue = id;
                    message = JSON.parse(body);
                }

                try {
                    if (pullWrite !== undefined) {
                        await pullWrite(this, message);
                    }
                    else {
                        await this.uqIn(uqIn, message);
                    }
                    console.log(`process in ${queue}: `, message);
                    await execProc('write_queue_in_p', [queueName, queue]);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    async uqIn(uqIn: UqIn, data: any) {
        switch (uqIn.type) {
            case 'tuid': await this.uqInTuid(uqIn as UqInTuid, data); break;
            case 'tuid-arr': await this.uqInTuidArr(uqIn as UqInTuidArr, data); break;
            case 'map': await this.uqInMap(uqIn as UqInMap, data); break;
        }
        //}
    }

    protected async uqInTuid(uqIn: UqInTuid, data: any): Promise<number> {
        let { key, mapper, uq: uqFullName, entity: tuid } = uqIn;
        if (key === undefined) throw 'key is not defined';
        if (uqFullName === undefined) throw 'tuid ' + tuid + ' not defined';
        let keyVal = data[key];
        let mapToUq = new MapToUq(this.uqInDict, this.unit);
        let body = await mapToUq.map(data, mapper);
        let uq = await this.uqs.getUq(uqFullName);
        let ret = await uq.saveTuid(tuid, body);
        let { id, inId } = ret;
        if (id < 0) id = -id;
        await map(tuid, id, keyVal);
        return id;
    }

    protected async uqInTuidArr(uqIn: UqInTuidArr, data: any): Promise<number> {
        let { key, owner, mapper, uq: uqFullName, entity } = uqIn;
        if (key === undefined) throw 'key is not defined';
        if (uqFullName === undefined) throw 'uq ' + uqFullName + ' not defined';
        if (entity === undefined) throw 'tuid ' + entity + ' not defined';
        let parts = entity.split('.');
        let tuid = parts[0];
        if (parts.length === 1) throw 'tuid ' + entity + ' must has .arr';
        let tuidArr = parts[1];
        let keyVal = data[key];
        if (owner === undefined) throw 'owner is not defined';
        let ownerVal = data[owner];
        let mapToUq = new MapToUq(this.uqInDict, this.unit);
        let ownerId = await this.mapOwner(uqIn, tuid, ownerVal);
        if (ownerId === undefined) throw 'owner value is undefined';
        let body = await mapToUq.map(data, mapper);
        let uq = await this.uqs.getUq(uqFullName);
        let ret = await uq.saveTuidArr(tuid, tuidArr, ownerId, body);
        let { id, inId } = ret;
        if (id === undefined) id = inId;
        else if (id < 0) id = -id;
        await map(entity, id, keyVal);
        return id;
    }

    private async mapOwner(uqIn: UqInTuidArr, ownerEntity: string, ownerVal: any) {
        let { uq: uqFullName } = uqIn;
        let sql = `select id from \`${databaseName}\`.\`map_${ownerEntity}\` where no='${ownerVal}'`;
        let ret: any[];
        try {
            ret = await execSql(sql);
        }
        catch (err) {
            await createMapTable(ownerEntity);
            ret = await execSql(sql);
        }
        if (ret.length === 0) {
            let uq = await this.uqs.getUq(uqFullName);
            let vId = await uq.getTuidVId(ownerEntity);
            await map(ownerEntity, vId, ownerVal);
            return vId;
        }
        return ret[0]['id'];
    }

    protected async uqInMap(uqIn: UqInMap, data: any): Promise<void> {
        let { mapper, uq: uqFullName, entity } = uqIn;
        let mapToUq = new MapToUq(this.uqInDict, this.unit);
        let body = await mapToUq.map(data, mapper);
        let uq = await this.uqs.getUq(uqFullName);
        let { $ } = data;
        if ($ === '-')
            await uq.delMap(entity, body);
        else
            await uq.setMap(entity, body);
    }

    private async scanOut() {
        let { uqOuts } = this.settings;
        if (uqOuts === undefined) return;
        for (let uqOut of uqOuts) {
            let { uq, entity } = uqOut;
            let queueName = uq + ':' + entity;
            console.log('scan out ' + queueName);
            for (; ;) {
                let queue: number;
                let retp = await tableFromProc('read_queue_out_p', [queueName]);
                if (retp.length === 0) queue = 0;
                else queue = retp[0].queue;
                let ret: { queue: number, data: any };
                ret = await this.uqOut(uqOut, queue);
                if (ret === undefined) break;
                let { queue: newQueue, data } = ret;
                await execProc('write_queue_out_p', [queueName, newQueue]);
            }
        }
    }

    async uqOut(uqOut: UqOut, queue: number): Promise<{ queue: number, data: any }> {
        let ret: { queue: number, data: any };
        let { type } = uqOut;
        switch (type) {
            //case 'bus': ret = await this.uqOutBus(uqOut as UqOutBus, queue); break;
        }
        return ret;
    }

    protected async scanBus() {
        let { name: joinName, bus } = this.settings;
        if (bus === undefined) return;
        let monikerPrefix = '$bus/';

        for (let uqBus of bus) {
            let { face, mapper, push, pull, uqIdProps } = uqBus;
            // bus out
            let moniker = monikerPrefix + face;
            for (; ;) {
                if (push === undefined) break;
                let queue: number;
                let retp = await tableFromProc('read_queue_out_p', [moniker]);
                if (retp.length > 0) {
                    queue = retp[0].queue;
                } else {
                    queue = 430000000000000;
                }
                let message = await this.uqs.readBus(face, queue);
                if (message === undefined) break;
                let { id: newQueue, from, body } = message;
                let json = await faceSchemas.unpackBusData(face, body);
                if (uqIdProps !== undefined && from !== undefined) {
                    let uq = await this.uqs.getUq(from);
                    if (uq !== undefined) {
                        let newJson = await uq.buildData(json, uqIdProps);
                        json = newJson;
                    }
                }

                let mapFromUq = new MapFromUq(this.uqInDict, this.unit);
                let outBody = await mapFromUq.map(json, mapper);
                if (await push(this, uqBus, queue, outBody) === false) break;
                await execProc('write_queue_out_p', [moniker, newQueue]);
            }

            // bus in
            for (; ;) {
                if (pull === undefined) break;
                let queue: number;
                let retp = await tableFromProc('read_queue_in_p', [moniker]);
                if (retp.length > 0) {
                    queue = retp[0].queue;
                } else {
                    queue = 0;
                }
                let message = await pull(this, uqBus, queue);
                if (message === undefined) break;
                let { queue: newQueue, data } = message;
                //let newQueue = await this.busIn(queue);
                //if (newQueue === undefined) break;
                let mapToUq = new MapToUq(this.uqInDict, this.unit);
                let inBody = await mapToUq.map(data, mapper);
                let packed = await faceSchemas.packBusData(face, inBody);
                await this.uqs.writeBus(face, joinName, newQueue, packed);
                await execProc('write_queue_in_p', [moniker, newQueue]);
            }
        }
    }
}
