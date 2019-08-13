import { Router } from "express";
import { Settings, UqIn, UqOut, DataPush, UqInTuid, UqInMap, UqInTuidArr, DataPullResult } from "./defines";
import { tableFromProc, execProc, execSql } from "./db/mysql/tool";
import { MapFromUq as MapFromUq, MapToUq as MapToUq } from "./tool/mapData";
import { map } from "./tool/map"; import { createRouter } from './router';
import { databaseName } from "./db/mysql/database";
import { createMapTable } from "./tool/createMapTable";
import { faceSchemas } from "./tool/faceSchemas";
import { Uqs } from "./uq/uq";
import { centerApi } from "./tool/centerApi";
import { OpenApi } from "./tool/openApi";
import { host } from "./tool/host";
import config from 'config';
import { getLogger } from 'log4js';

const logger = getLogger('joint');
const uqInEntities = config.get<string[]>("afterFirstEntities");

const interval = 3 * 1000;

export class Joint {
    protected uqs: Uqs;
    protected settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
        let { unit, uqIns: allUqIns } = settings;
        this.unit = unit;
        if (allUqIns === undefined) return;
        this.uqs = new Uqs(this, unit);
        for (let uqIn of allUqIns) {
            let { entity, type } = uqIn;
            if (this.uqInDict[entity] !== undefined) throw 'can not have multiple ' + entity;
            this.uqInDict[entity] = uqIn;
        }
    }

    readonly uqInDict: { [tuid: string]: UqIn } = {};
    readonly unit: number;

    createRouter(): Router {
        return createRouter(this.settings);
    }

    async init() {
        await host.start();
        centerApi.initBaseUrl(host.centerUrl);
        await this.uqs.init();
    }

    async start() {
        await this.init();
        setTimeout(this.tick, interval);
    }

    private tick = async () => {
        try {
            console.log('tick ' + new Date().toLocaleString());
            //await this.scanPull();
            // await this.scanIn();
            // await this.scanOut();
            // bus还没有弄好，暂时屏蔽
            await this.scanBus();
        }
        catch (err) {
            logger.error('error in timer tick');
            logger.error(err);
        }
        finally {
            setTimeout(this.tick, interval);
        }
    }

    private uqOpenApis: { [uqFullName: string]: { [unit: number]: OpenApi } } = {};
    //async getOpenApi(uqFullName:string, unit:number):Promise<OpenApi> {
    async getOpenApi(uq: string): Promise<OpenApi> {
        let openApis = this.uqOpenApis[uq];
        if (openApis === null) return null;
        if (openApis === undefined) {
            this.uqOpenApis[uq] = openApis = {};
        }
        let uqUrl = await centerApi.urlFromUq(this.unit, uq);
        if (uqUrl === undefined) return openApis[this.unit] = null;
        //let {url, urlDebug} = uqUrl;
        //url = await host.getUrlOrDebug(url, urlDebug);
        /*
        if (urlDebug !== undefined) {
            try {
                urlDebug = urlSetUqHost(urlDebug);
                urlDebug = urlSetUnitxHost(urlDebug);
                let ret = await fetch(urlDebug + 'hello');
                if (ret.status !== 200) throw 'not ok';
                let text = await ret.text();
                url = urlDebug;
            }
            catch (err) {
            }
        }
        */
        let { db, url, urlTest } = uqUrl;
        let realUrl = host.getUrlOrTest(db, url, urlTest)
        return openApis[this.unit] = new OpenApi(realUrl, this.unit);
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

    /**
     *
     */
    private async scanIn() {

        let { pullReadFromSql } = this.settings;
        for (let uqInName of uqInEntities) {

            let uqIn = this.uqInDict[uqInName];
            if (uqIn === undefined) continue;

            let { uq, entity, pull, pullWrite } = uqIn;
            let queueName = uq + ':' + entity;
            console.log('scan in ' + queueName + ' at ' + new Date().toLocaleString());
            let promises: PromiseLike<any>[] = [];
            for (; ;) {
                let message: any;
                let queue: string;
                let ret: DataPullResult = undefined;
                if (pull !== undefined) {
                    let retp = await tableFromProc('read_queue_in_p', [queueName]);
                    if (retp.length > 0) {
                        queue = retp[0].queue;
                    } else {
                        queue = '0';
                    }
                    switch (typeof pull) {
                        case 'function':
                            ret = await pull(this, uqIn, queue);
                            break;
                        case 'string':
                            if (pullReadFromSql === undefined) {
                                let err = 'pullReadFromSql should be defined in settings!';
                                throw err;
                            }
                            ret = await pullReadFromSql(pull as string, queue);
                            break;
                    }
                    if (ret === undefined) break;
                    // queue = ret.queue;
                    // message = ret.data;
                }
                else {
                    let retp = await tableFromProc('read_queue_in', [queueName]);
                    if (!retp || retp.length === 0) break;
                    let { id, body, date } = retp[0];
                    ret = { lastPointer: id, data: [JSON.parse(body)] };
                    // queue = id;
                    // message = JSON.parse(body);
                }

                let { lastPointer, data } = ret;
                data.forEach(message => {
                    if (pullWrite !== undefined) {
                        promises.push(pullWrite(this, message));
                    }
                    else {
                        promises.push(this.uqIn(uqIn, message));
                    }
                });

                try {
                    await Promise.all(promises);
                    promises.splice(0);
                    await execProc('write_queue_in_p', [queueName, lastPointer]);
                } catch (error) {
                    logger.error(error);
                    break;
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
    }

    protected async uqInTuid(uqIn: UqInTuid, data: any): Promise<number> {
        let { key, mapper, uq: uqFullName, entity: tuid } = uqIn;
        if (key === undefined) throw 'key is not defined';
        if (uqFullName === undefined) throw 'tuid ' + tuid + ' not defined';
        let keyVal = data[key];
        let mapToUq = new MapToUq(this);
        let body = await mapToUq.map(data, mapper);
        let uq = await this.uqs.getUq(uqFullName);
        try {
            let ret = await uq.saveTuid(tuid, body);
            let { id, inId } = ret;
            if (id) {
                if (id < 0) id = -id;
                await map(tuid, id, keyVal);
                return id;
            } else {
                logger.error('save ' + uqFullName + ':' + tuid + ' no ' + keyVal + ' failed.');
                logger.error(body);
            }
        } catch (error) {
            if (error.code === "ETIMEDOUT") {
                logger.error(error);
                await this.uqInTuid(uqIn, data);
            } else {
                logger.error(uqFullName + ':' + tuid);
                logger.error(body);
                throw error;
            }
        }
    }

    protected async uqInTuidArr(uqIn: UqInTuidArr, data: any): Promise<number> {
        let { key, owner, mapper, uq: uqFullName, entity } = uqIn;
        if (key === undefined) throw 'key is not defined';
        if (uqFullName === undefined) throw 'uq ' + uqFullName + ' not defined';
        if (entity === undefined) throw 'tuid ' + entity + ' not defined';
        let parts = entity.split('_');
        let tuidOwner = parts[0];
        if (parts.length === 1) throw 'tuid ' + entity + ' must has .arr';
        let tuidArr = parts[1];
        let keyVal = data[key];
        if (owner === undefined) throw 'owner is not defined';
        let ownerVal = data[owner];
        try {
            let mapToUq = new MapToUq(this);
            let ownerId = await this.mapOwner(uqIn, tuidOwner, ownerVal);
            if (ownerId === undefined) throw 'owner value is undefined';
            let body = await mapToUq.map(data, mapper);
            let uq = await this.uqs.getUq(uqFullName);
            let ret = await uq.saveTuidArr(tuidOwner, tuidArr, ownerId, body);
            let { id, inId } = ret;
            if (id === undefined) id = inId;
            else if (id < 0) id = -id;
            if (id) {
                await map(entity, id, keyVal);
                return id;
            } else {
                logger.error('save tuid arr ' + uqFullName + ':' + entity + ' no: ' + keyVal + ' failed.');
                logger.error(body);
            }
        } catch (error) {
            if (error.code === "ETIMEDOUT") {
                logger.error(error);
                await this.uqInTuidArr(uqIn, data);
            } else {
                logger.error('save tuid arr ' + uqFullName + ':' + entity + ' no: ' + keyVal + ' failed.');
                throw error;
            }
        }
    }

    /**
     * 在tuidDiv中，根据其owner的no获取id，若owner尚未生成id，则生成之
     * @param uqIn
     * @param ownerEntity
     * @param ownerVal
     */
    private async mapOwner(uqIn: UqInTuidArr, ownerEntity: string, ownerVal: any) {
        let { uq: uqFullName } = uqIn;
        let sql = `select id from \`${databaseName}\`.\`map_${ownerEntity.toLowerCase()}\` where no='${ownerVal}'`;
        let ret: any[];
        try {
            ret = await execSql(sql);
        }
        catch (err) {
            await createMapTable(ownerEntity);
            ret = await execSql(sql);
        }
        if (ret.length === 0) {
            try {
                let uq = await this.uqs.getUq(uqFullName);
                let vId = await uq.getTuidVId(ownerEntity);
                await map(ownerEntity, vId, ownerVal);
                return vId;
            } catch (error) {
                if (error.code === "ETIMEDOUT") {
                    logger.error(error);
                    this.mapOwner(uqIn, ownerEntity, ownerVal);
                } else {
                    throw error;
                }

            }
        }
        return ret[0]['id'];
    }

    protected async uqInMap(uqIn: UqInMap, data: any): Promise<void> {
        let { mapper, uq: uqFullName, entity } = uqIn;
        let mapToUq = new MapToUq(this);
        let body = await mapToUq.map(data, mapper);

        try {
            let uq = await this.uqs.getUq(uqFullName);
            let { $ } = data;
            if ($ === '-')
                await uq.delMap(entity, body);
            else
                await uq.setMap(entity, body);
        } catch (error) {
            if (error.code === "ETIMEDOUT") {
                logger.error(error);
                await this.uqInMap(uqIn, data);
            } else {
                throw error;
            }
        }
    }

    /**
     *
     */
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

    /**
     *
     */
    protected async scanBus() {
        let { name: joinName, bus } = this.settings;
        if (bus === undefined) return;
        let monikerPrefix = '$bus/';

        for (let uqBus of bus) {
            let { face, from: busFrom, mapper, push, pull, uqIdProps } = uqBus;
            // bus out(从bus中读取消息，发送到外部系统)
            let moniker = monikerPrefix + face;
            for (; ;) {
                if (push === undefined) break;
                let queue: number;
                let retp = await tableFromProc('read_queue_out_p', [moniker]);
                if (retp.length > 0) {
                    queue = retp[0].queue;
                } else {
                    // queue = 430000000000000;
                    queue = 0;
                }
                let newQueue, json;
                if (busFrom === 'center') {
                    let message = await this.userOut(face, queue);
                    if (message === undefined && message['$queue'] === undefined) break;
                    newQueue = message['$queue'];
                    json = message;
                } else {
                    let message = await this.uqs.readBus(face, queue);
                    if (message === undefined) break;
                    let { id, from, body } = message;
                    newQueue = id;
                    json = await faceSchemas.unpackBusData(face, body);
                    if (uqIdProps !== undefined && from !== undefined) {
                        let uq = await this.uqs.getUq(from);
                        if (uq !== undefined) {
                            try {
                                let newJson = await uq.buildData(json, uqIdProps);
                                json = newJson;
                            } catch (error) {
                                logger.error(error);
                                break;
                            }
                        }
                    }
                }

                let mapFromUq = new MapFromUq(this);
                let outBody = await mapFromUq.map(json, mapper);
                if (await push(this, uqBus, queue, outBody) === false) break;
                await execProc('write_queue_out_p', [moniker, newQueue]);
            }

            // bus in(从外部系统读入数据，写入bus)
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
                let { lastPointer: newQueue, data } = message;
                //let newQueue = await this.busIn(queue);
                //if (newQueue === undefined) break;
                let mapToUq = new MapToUq(this);
                let inBody = await mapToUq.map(data[0], mapper);
                let packed = await faceSchemas.packBusData(face, inBody);
                await this.uqs.writeBus(face, joinName, newQueue, packed);
                await execProc('write_queue_in_p', [moniker, newQueue]);
            }
        }
    }

    protected async userOut(face: string, queue: number) {
        let ret = await centerApi.queueOut(queue, 1);
        return ret !== undefined && ret.length === 1 && ret[0];
    }

    public async userIn(uqIn: UqInTuid, data: any): Promise<number> {
        let { key, mapper, uq: uqFullName, entity: tuid } = uqIn;
        if (key === undefined) throw 'key is not defined';
        if (uqFullName === undefined) throw 'tuid ' + tuid + ' not defined';
        let keyVal = data[key];
        let mapToUq = new MapToUq(this);
        try {
            let body = await mapToUq.map(data, mapper);
            let ret = await centerApi.queueIn(body);
            if (ret === undefined || typeof ret !== 'number')
                throw new Error('user in 返回值不正确。');
            if (ret > 0)
                await map(tuid, ret, keyVal);
            return ret;
        } catch (error) {
            throw error;
        }
    }
}