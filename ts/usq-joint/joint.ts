import { Router } from "express";
import { Settings, UsqIn, UsqOut, DataPush, UsqInConverter, UsqInTuid, UsqInMap, UsqInAction, UsqInTuidArr } from "./defines";
import { tableFromProc, execProc, execSql } from "./db/mysql/tool";
import { getOpenApi } from "./tool/openApi";
import { MapFromUsq, MapToUsq } from "./tool/mapData";
import { map } from "./tool/map";import { createRouter } from './router';
import { databaseName } from "./db/mysql/database";
import { createMapTable } from "./tool/createMapTable";

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
    
    private async scanIn() {
        for (let i in this.settings.in) {
            console.log('scan in ', i);
            let usqIn = this.settings.in[i];
            for (;;) {
                let retp = await tableFromProc('read_queue_in', [i]);
                if (!retp || retp.length === 0) break;
                let {id, body, date} = retp[0];
                let data = JSON.parse(body);
                await this.usqIn(usqIn, data);
                console.log(`process in ${id} ${(date as Date).toLocaleString()}: `, body);
                await execProc('write_queue_in_p', [i, id]);
            }
        }
    }

    protected async getOpenApi(usq: string) {
        let openApi = await getOpenApi(usq, this.settings.unit);
        return openApi;
    }

    async pushToUsq(usqInName:string, data:any) {
        let usqIn = this.settings.in[usqInName];
        if (usqIn === undefined) {
            console.log('usqIn "' + usqInName + '" is not defined');
            return;
        }
        await this.usqIn(usqIn, data);
    }

    private async usqIn(usqIn:UsqIn|UsqInConverter, data:any) {
        if (typeof usqIn === 'function')
            await usqIn(this.settings, data);
        else {
            switch (usqIn.type) {
                case 'tuid': await this.usqInTuid(usqIn as UsqInTuid, data); break;
                case 'tuid-arr': await this.usqInTuidArr(usqIn as UsqInTuidArr, data); break;
                case 'map': await this.usqInMap(usqIn as UsqInMap, data); break;
                case 'action': await this.usqInAction(usqIn as UsqInAction, data); break;
            }
        }
    }

    protected async usqInTuid(usqIn:UsqInTuid, data:any):Promise<number> {
        let {key, mapper, usq, entity:tuid} = usqIn;
        if (key === undefined) throw 'key is not defined';
        if (usq === undefined) throw 'tuid ' + tuid + ' not defined';
        let keyVal = data[key];
        let mapToUsq = new MapToUsq(this.settings);
        let body = await mapToUsq.map(data, mapper);
        let openApi = await this.getOpenApi(usq);
        let ret = await openApi.saveTuid(tuid, body);
        let {id, inId} = ret;
        if (id < 0) id = -id;
        await map(tuid, id, keyVal);
        return id;
    }
    
    protected async usqInTuidArr(usqIn:UsqInTuidArr, data:any):Promise<number> {
        let {key, owner, mapper, usq, entity} = usqIn;
        if (key === undefined) throw 'key is not defined';
        if (usq === undefined) throw 'usq ' + usq + ' not defined';
        if (entity === undefined) throw 'tuid ' + entity + ' not defined';
        let parts = entity.split('.');
        let tuid = parts[0];
        if (parts.length === 1) throw 'tuid ' + entity + ' must has .arr';
        let tuidArr = parts[1];
        let keyVal = data[key];
        if (owner === undefined) throw 'owner is not defined';
        let ownerVal = data[owner];
        let mapToUsq = new MapToUsq(this.settings);
        //let ownerId = await mapToUsq.mapOwner(entity, ownerVal);
        let ownerId = await this.mapOwner(usqIn, tuid, ownerVal);
        if (ownerId === undefined) throw 'owner value is undefined';
        let body = await mapToUsq.map(data, mapper);
        let openApi = await this.getOpenApi(usq);
        let ret = await openApi.saveTuidArr(tuid, tuidArr, ownerId, body);
        let {id, inId} = ret;
        if (id === undefined) id = inId;
        else if (id < 0) id = -id;
        await map(entity, id, keyVal);
        return id;
    }

    private async mapOwner(usqIn:UsqInTuidArr, ownerEntity:string, ownerVal:any) {
        let {usq} = usqIn;
        let sql = `select id from \`${databaseName}\`.\`map_${ownerEntity}\` where no='${ownerVal}'`;
        let ret:any[];
        try {
            ret = await execSql(sql);
        }
        catch (err) {
            await createMapTable(ownerEntity);
            ret = await execSql(sql);
        }
        if (ret.length === 0) {
            /*
            let usqIn = this.settings.in[tuid];
            if (typeof usqIn !== 'object') {
                throw `tuid ${tuid} is not defined in settings.in`;
            }
            */
            let openApi = await getOpenApi(usq, this.settings.unit);
            let vId = await openApi.getTuidVId(ownerEntity);
            await map(ownerEntity, vId, ownerVal);
            return vId;
        }
        return ret[0]['id'];
    }
    
    protected async usqInMap(usqIn:UsqInMap, data:any):Promise<void> {
        let {mapper, usq, entity} = usqIn;
        let mapToUsq = new MapToUsq(this.settings);
        let body = await mapToUsq.map(data, mapper);
        let openApi = await this.getOpenApi(usq);
        let {$} = data;
        if ($ === '-') 
            await openApi.delMap(entity, body);
        else
            await openApi.setMap(entity, body);
    }

    protected async usqInAction(usqIn:UsqInAction, data:any):Promise<void> {
        let {mapper, usq, entity} = usqIn;
        let mapToUsq = new MapToUsq(this.settings);
        let body = await mapToUsq.map(data, mapper);
        let openApi = await this.getOpenApi(usq);
        await openApi.action(entity, body);
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
                    await push(this, data);
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
