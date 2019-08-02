import { Router } from "express";
import { Settings, UqIn, UqOut, DataPush, UqInTuid, UqInMap, UqInTuidArr } from "./defines";
import { tableFromProc, execProc, execSql } from "./db/mysql/tool";
import { OpenApi } from "./tool/openApi";
import { MapFromUq as MapFromUq, MapToUq } from "./tool/mapData";
import { map } from "./tool/map"; import { createRouter } from './router';
import { databaseName } from "./db/mysql/database";
import { createMapTable } from "./tool/createMapTable";
import { faceSchemas } from "./tool/faceSchemas";
import { Mapper } from "./tool/mapper";
import { ProdOrTest } from "./tool/prodOrTest";
import { centerApi } from "./tool/centerApi";
import { host } from "./tool/host";

//const isDevelopment = process.env.NODE_ENV === 'development';

const interval = 60 * 1000;
const $unitx = '$$$/$unitx';

export abstract class Joint {
    protected settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
        let { unit, uqIns } = settings;
        this.unit = unit;
        this.uqInDict = {};
        if (uqIns === undefined) return;
        for (let uqIn of uqIns) {
            let { entity, type } = uqIn;
            if (this.uqInDict[entity] !== undefined) throw 'can not have multiple ' + entity;
            this.uqInDict[entity] = uqIn;
        }
    }

    readonly uqInDict: { [tuid: string]: UqIn };
    readonly unit: number;

    protected abstract get prodOrTest(): ProdOrTest;

    createRouter(): Router {
        return createRouter(this.settings);
    }

    async start():Promise<void> {
        await host.start(this.prodOrTest === 'test');
        centerApi.initBaseUrl(host.centerUrl);
        setTimeout(this.tick, 3 * 1000);
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
        let { uqIns } = this.settings;
        if (uqIns === undefined) return;
        for (let uqIn of uqIns) {
            let { uq, entity } = uqIn;
            let queueName = uq + ':' + entity;
            console.log('scan in ' + queueName);
            for (; ;) {
                let retp = await tableFromProc('read_queue_in', [queueName]);
                if (!retp || retp.length === 0) break;
                let { id, body, date } = retp[0];
                let data = JSON.parse(body);
                await this.uqIn(uqIn, data);
                console.log(`process in ${id} ${(date as Date).toLocaleString()}: `, body);
                await execProc('write_queue_in_p', [queueName, id]);
            }
        }
    }

    private  uqOpenApis: {[uqFullName:string]: {[unit:number]:OpenApi}} = {};
    //async getOpenApi(uqFullName:string, unit:number):Promise<OpenApi> {
    async getOpenApi(uq: string):Promise<OpenApi> {
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
        let {db, url, urlTest} = uqUrl;
        let realUrl = host.getUrlOrTest(db, url, urlTest)
        return openApis[this.unit] = new OpenApi(realUrl, this.unit);
    }

    /*
    private getUrlOrDebug(url:string, debugHost:string = 'uqhost'):string {
        if (isDevelopment === false) return url;
        let host = hosts[debugHost];
        if (host === undefined) return url;
        let {value, local} = host;
        if (local === false) return url;
        return `http://${value}/`;
    }
    private getUrlOrTest(db:string, url:string, urlTest:string):string {
        let path:string;
        if (this.prodOrTest === 'test') {
            if (urlTest !== '-') url = urlTest;
            path = 'uq/test/' + db + '/';
        }
        else {
            path = 'uq/prod/' + db + '/';
        }
        url = this.getUrlOrDebug(url);
        return url + path;
    }
    */

    /*
    async getOpenApi(uq: string) {
            let openApi = await getOpenApi(uq, this.settings.unit);
            return openApi;
        }
    */
    /*
    async pushToUq(uqInName:string, data:any) {
        let uqIn = this.settings.in[uqInName];
        if (uqIn === undefined) {
            console.log('uqIn "' + uqInName + '" is not defined');
            return;
        }
        await this.uqIn(uqIn, data);
    }
    */

    async uqIn(uqIn: UqIn, data: any) {
        /*
        if (typeof uqIn === 'function')
            await uqIn(this.settings, data);
        else {
        */
        switch (uqIn.type) {
            case 'tuid': await this.uqInTuid(uqIn as UqInTuid, data); break;
            case 'tuid-arr': await this.uqInTuidArr(uqIn as UqInTuidArr, data); break;
            case 'map': await this.uqInMap(uqIn as UqInMap, data); break;
        }
        //}
    }

    protected async uqInTuid(uqIn: UqInTuid, data: any): Promise<number> {
        let { key, mapper, uq: uq, entity: tuid } = uqIn;
        if (key === undefined) throw 'key is not defined';
        if (uq === undefined) throw 'tuid ' + tuid + ' not defined';
        let keyVal = data[key];
        let mapToUq = new MapToUq(this);
        let body = await mapToUq.map(data, mapper);
        let openApi = await this.getOpenApi(uq);
        let ret = await openApi.saveTuid(tuid, body);
        let { id, inId } = ret;
        if (id < 0) id = -id;
        await map(tuid, id, keyVal);
        return id;
    }

    protected async uqInTuidArr(uqIn: UqInTuidArr, data: any): Promise<number> {
        let { key, owner, mapper, uq: uq, entity } = uqIn;
        if (key === undefined) throw 'key is not defined';
        if (uq === undefined) throw 'uq ' + uq + ' not defined';
        if (entity === undefined) throw 'tuid ' + entity + ' not defined';
        let parts = entity.split('.');
        let tuid = parts[0];
        if (parts.length === 1) throw 'tuid ' + entity + ' must has .arr';
        let tuidArr = parts[1];
        let keyVal = data[key];
        if (owner === undefined) throw 'owner is not defined';
        let ownerVal = data[owner];
        let mapToUq = new MapToUq(this);
        //let ownerId = await mapToUq.mapOwner(entity, ownerVal);
        let ownerId = await this.mapOwner(uqIn, tuid, ownerVal);
        if (ownerId === undefined) throw 'owner value is undefined';
        let body = await mapToUq.map(data, mapper);
        let openApi = await this.getOpenApi(uq);
        let ret = await openApi.saveTuidArr(tuid, tuidArr, ownerId, body);
        let { id, inId } = ret;
        if (id === undefined) id = inId;
        else if (id < 0) id = -id;
        await map(entity, id, keyVal);
        return id;
    }

    private async mapOwner(uqIn: UqInTuidArr, ownerEntity: string, ownerVal: any) {
        let { uq } = uqIn;
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
            /*
            let uqIn = this.settings.in[tuid];
            if (typeof uqIn !== 'object') {
                throw `tuid ${tuid} is not defined in settings.in`;
            }
            */
            //let openApi = await getOpenApi(uq, this.settings.unit);
            let openApi = await this.getOpenApi(uq);
            let vId = await openApi.getTuidVId(ownerEntity);
            await map(ownerEntity, vId, ownerVal);
            return vId;
        }
        return ret[0]['id'];
    }

    protected async uqInMap(uqIn: UqInMap, data: any): Promise<void> {
        let { mapper, uq, entity } = uqIn;
        let mapToUq = new MapToUq(this);
        let body = await mapToUq.map(data, mapper);
        let openApi = await this.getOpenApi(uq);
        let { $ } = data;
        if ($ === '-')
            await openApi.delMap(entity, body);
        else
            await openApi.setMap(entity, body);
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
                //let push: DataPush;
                /*
                if (typeof uqOut === 'function')
                    ret = await uqOut(this.settings, queue);
                else {
                */
                //push = uqOut.push;
                ret = await this.uqOut(uqOut, queue);
                //}
                if (ret === undefined) break;
                let { queue: newQueue, data } = ret;
                //if (push === undefined) {
                //    await execProc('write_queue_out', [i, newQueue, JSON.stringify(data)]);
                //}
                //else {
                //    await push(this, data);
                await execProc('write_queue_out_p', [queueName, newQueue]);
                //}
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
        let openApi = await this.getOpenApi($unitx);

        for (let uqBus of bus) {
            let { face, mapper, push, pull } = uqBus;
            // bus out
            let moniker = monikerPrefix + face;
            for (; ;) {
                if (push === undefined) break;
                let queue: number;
                let retp = await tableFromProc('read_queue_out_p', [moniker]);
                if (retp.length > 0) {
                    queue = retp[0].queue;
                }
                let message = await openApi.readBus(face, queue);
                if (message === undefined) break;
                let { id: newQueue, from, body } = message;
                //await this.busOut(face, newQueue, message, mapper, push);
                let json = await faceSchemas.unpackBusData(face, body);
                let mapFromUq = new MapFromUq(this);
                let outBody = await mapFromUq.map(json, mapper);
                if (await push(face, queue, outBody) === false) break;
                await execProc('write_queue_out_p', [moniker, newQueue]);
            }

            // bus in
            for (; ;) {
                if (pull === undefined) break;
                let queue: number;
                let retp = await tableFromProc('read_queue_in_p', [moniker]);
                if (retp.length > 0) {
                    queue = retp[0].queue;
                }
                let message = await pull(face, queue);
                if (message === undefined) break;
                let { queue: newQueue, data } = message;
                //let newQueue = await this.busIn(queue);
                //if (newQueue === undefined) break;
                let mapToUq = new MapToUq(this);
                let inBody = await mapToUq.map(data, mapper);
                let packed = await faceSchemas.packBusData(face, inBody);
                await openApi.writeBus(face, joinName, newQueue, packed);
                await execProc('write_queue_in_p', [moniker, newQueue]);
            }
        }
    }
}

export class ProdJoint extends Joint {
    protected get prodOrTest(): ProdOrTest {return 'prod'}
}

export class TestJoint extends Joint {
    protected get prodOrTest(): ProdOrTest {return 'test'}
}
