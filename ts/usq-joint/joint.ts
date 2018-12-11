import { Settings, UsqIn, UsqOut, DataPush } from "./defines";
import { tableFromProc, execProc } from "./db/mysql/tool";
//import { usqInDefault } from "./scanIn";
//import { usqInTuid, usqInMap, usqInAction } from "./tool";
//import { usqOutDefault } from "./scanOut";
//import { usqOutSheet } from "./tool/usqOutSheet";
import { getOpenApi } from "./tool/openApi";
import { MapFromUsq, MapToUsq } from "./tool/mapData";
import { map } from "./tool/map";
import { Router } from "express";
import { createRouter } from './router';

const interval = 60*1000;

export class Joint {
    protected settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
    }

    createRouter():Router {
        return createRouter(this.settings);
    }

    startTimer() {
        setTimeout(this.tick, 3*1000);
    }

    private tick = async () => {
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
    }

    private async scanPull() {
        for (let i in this.settings.pull) {
            console.log('scan pull ', i);
            let pull = this.settings.pull[i];
            for (;;) {
                let retp = await tableFromProc('read_queue_in_p', [i]);
                if (!retp || retp.length === 0) break;
                let {id} = retp[0];
                let queue = await pull(this.settings, id);
                if (queue === undefined) break;
                await execProc('write_queue_in_p', [i, queue]);
            }
        }
    }
    
    private async scanIn() {
        for (let i in this.settings.in) {
            console.log('scan in ', i);
            let usqIn = this.settings.in[i];
            for (;;) {
                let retp = await tableFromProc('read_queue_in', [i]);
                if (!retp || retp.length === 0) break;
                let {id, body, date} = retp[0];
                let data = JSON.parse(body);
                if (typeof usqIn === 'function')
                    await usqIn(this.settings, data);
                else 
                    await this.usqInDefault(usqIn, data);
                console.log(`process in ${id} ${(date as Date).toLocaleString()}: `, body);
                await execProc('write_queue_in_p', [i, id]);
            }
        }
    }

    protected async getOpenApi(usq: string) {
        let openApi = await getOpenApi(usq, this.settings.unit);
        return openApi;
    }

    async usqInDefault(usqIn:UsqIn, data:any) {
        switch (usqIn.type) {
            case 'tuid': await this.usqInTuid(usqIn, data); break;
            case 'map': await this.usqInMap(usqIn, data); break;
            case 'action': await this.usqInAction(usqIn, data); break;
        }
    }

    protected async usqInTuid(usqIn:UsqIn, data:any):Promise<number> {
        let {key, mapper, usq, entity:tuid} = usqIn;
        let keyVal = data[key];
        if (key === undefined) throw 'key is not defined';
        let mapToUsq = new MapToUsq(this.settings);
        let body = await mapToUsq.map(data, mapper);
        if (usq === undefined) throw 'tuid ' + tuid + ' not defined';
        let openApi = await this.getOpenApi(usq);
        let ret = await openApi.saveTuid(tuid, body);
        let {id, inId} = ret;
        if (id < 0) id = -id;
        await map(tuid, id, keyVal);
        return id;
    }
    
    protected async usqInMap(usqIn:UsqIn, data:any):Promise<number> {
        let {key, mapper, usq, entity:tuid} = usqIn;
        let keyVal = data[key];
        if (key === undefined) throw 'key is not defined';
        let mapToUsq = new MapToUsq(this.settings);
        let body = await mapToUsq.map(data, mapper);
        if (usq === undefined) throw 'tuid ' + tuid + ' not defined';
        let openApi = await this.getOpenApi(usq);
        let ret = await openApi.saveTuid(tuid, body);
        let {id, inId} = ret;
        if (id < 0) id = -id;
        await map(tuid, id, keyVal);
        return id;
    }

    protected async usqInAction(usqIn:UsqIn, data:any):Promise<number> {
        let {key, mapper, usq, entity:tuid} = usqIn;
        let keyVal = data[key];
        if (key === undefined) throw 'key is not defined';
        let mapToUsq = new MapToUsq(this.settings);
        let body = await mapToUsq.map(data, mapper);
        if (usq === undefined) throw 'tuid ' + tuid + ' not defined';
        let openApi = await this.getOpenApi(usq);
        let ret = await openApi.saveTuid(tuid, body);
        let {id, inId} = ret;
        if (id < 0) id = -id;
        await map(tuid, id, keyVal);
        return id;
    }
        
    private async scanOut() {
        for (let i in this.settings.out) {
            console.log('scan out ', i);
            let usqOut = this.settings.out[i];
            for (;;) {
                let queue:number;
                let retp = await tableFromProc('read_queue_out_p', [i]);
                if (retp.length === 0) queue = 0;
                else queue = retp[0].queue;
                let ret:{queue:number, data:any};
                let push: DataPush;
                if (typeof usqOut === 'function')
                    ret = await usqOut(this.settings, queue);
                else {
                    push = usqOut.push;
                    ret = await this.usqOutDefault(usqOut, queue);
                }
                if (ret === undefined) break;
                let {queue:newQueue, data} = ret;
                if (push === undefined) {
                    await execProc('write_queue_out', [i, newQueue, JSON.stringify(data)]);
                }
                else {
                    await push(this.settings, data);
                    await execProc('write_queue_out_p', [i, newQueue]);
                }
            }
        }
    }
    
    async usqOutDefault(usqOut:UsqOut, queue:number):Promise<{queue:number, data:any}> {
        let ret:{queue:number, data:any};
        let {type} = usqOut;
        switch (type) {
            case 'sheet': ret = await this.usqOutSheet(usqOut, queue); break;
        }
        return ret;
    }

    protected async usqOutSheet(usqOut:UsqOut, queue:number):Promise<{queue:number, data:any}>{
        let {usq, entity, key, mapper} = usqOut;
        let openApi = await this.getOpenApi(usq);
        let sheet = await openApi.scanSheet(entity, queue);
        if (sheet === undefined) return;
        let {id} = sheet;
        let mapFromUsq = new MapFromUsq(this.settings);
        let body = await mapFromUsq.map(sheet, mapper);
        let keyVal = 'usq-' + id;
        body[key] = keyVal;
        await map(entity, id, keyVal);
        return {queue: id, data: body};
    }
}
